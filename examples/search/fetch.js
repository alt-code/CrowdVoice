var Twit = require('twit');
var jsonfile = require('jsonfile');
var _ = require("underscore");
var config = require('./config.js');

var fs = require('fs');
var path = require('path');
var split = require('split'); 

var T = new Twit(
{
	consumer_key:         config.consumer_key,
	consumer_secret:      config.consumer_secret,
	access_token:         config.access_token,
	access_token_secret:  config.access_token_secret
});
console.log(config);

var output = "tweets.json"
var tweets = {};
// Get last statuses
if( fs.existsSync(output) )
{
	tweets = require("./" + output);
	console.log("Loading previous tweets " + _.keys(tweets).length)
}

var process = 
{
	lookup: function(list,callback)
	{
		if( list.length > 100 )
		{
			console.error("I can only fit 100 tweets per request, please make smaller");
			return;
		}

		try
		{
			var ids = list.join();
			console.log("Fetching ",list.length, " ids");

			T.get('statuses/lookup', 
				{id: ids}, function (err,data,response) 
				{
					if( data )
					{
						for( var i =0; i < data.length;i++)
						{
							var tweet = data[i];
							tweets[tweet.id] = tweet;
						}
					}
					callback();
				});
		}
		catch(e)
		{
			console.error(e);
			process.onDone();
		}
	},
	onDone: function()
	{
		jsonfile.writeFile("tweets.json", tweets, function (err)
		{
  			console.error(err);
		});
	}
};

var buffer = [];
var stream = fs.createReadStream("all.txt")
    .pipe(split())
    .on('data', function (line) 
    {
    	if( line )
    	{
			var regex = /status\/(\d+)$/
			var result = line.match(regex);
			var statusNumber = result[1];
			if( statusNumber )
			{
				if( buffer.length < 100 )
				{
					if(!tweets.hasOwnProperty(statusNumber))
					buffer.push(statusNumber);
				}
				else
				{
					process.lookup(buffer, function()
					{
						console.log("tweets fetched", _.keys(tweets).length);
					});

					buffer = [];
					stream.pause();
				}
			}
		}
	 })
    .on('error', function (err) 
    {
    	console.error(err);
    })
    .on('end', function () 
    {
    	process.onDone();
    });

setInterval(function() 
	{
		console.log("resuming stream");
		stream.resume();
	}, 10000);

//process.lookup(["628307329503485952","628307738523627520","628309464429408256","628310679921885184"]);
