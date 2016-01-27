var Twit = require('twit');
var jsonfile = require('jsonfile');
var _ = require("underscore");
var config = require('./config.js');


var fs = require('fs');
var path = require('path');


var T = new Twit(
{
	consumer_key:         config.consumer_key,
	consumer_secret:      config.consumer_secret,
	access_token:         config.access_token,
	access_token_secret:  config.access_token_secret
});
console.log(config);

var tag = '#ILookLikeAnEngineer  exclude:retweets'
var output = "statuses.json";

var sum   = 0;
var total = 100000;
var allStatuses = {};
var last_tag = '';

// Get last statuses
if( fs.existsSync(output) )
{
	allStatuses = require("./" + output);
	console.log("Loading previous tweets " + _.keys(allStatuses).length)
}
 
var filePath = path.join(__dirname, 'lastID.txt');

var process = 
{
	start: function()
	{
		T.get('search/tweets', 
			{ q: tag, count: 100, result_type: 'recent' }, ProcessResults
		);
	},
	onDone: function()
	{
		jsonfile.writeFile("statuses.json", allStatuses, function (err)
		{
  			console.error(err);
		});

		if( last_tag  )
		{
			fs.writeFile('lastID.txt', last_tag , function (err) {
 				if (err) return console.log(err);
  			
			});
		}
	},

	searchTweetsSince: function(tag,sinceId)
	{
		T.get('search/tweets', 
			{ q: tag, count: 100, result_type: 'recent', max_id: sinceId },
			ProcessResults
		);
	}

};




startOrResumeSearch(); 
//process.start();
//SearchTweetsSince(tag,x);


// Read last id from file
// If last id file doesn't exist:
// reads the file, and gets the last id from the file 
// the file is called lastID.txt
function startOrResumeSearch()
{
	if( fs.existsSync(filePath) )
	{
		fs.readFile(filePath, {encoding: 'utf-8'}, 
		function(err,data)
		{
    		if (err) console.log(err);
     
   		if(data && data.length != 0)
			{
        		console.log('resuming search at: ' + data);
				process.searchTweetsSince(tag , parseInt(data));
			}
		});
	}
	else
	{
		console.log("Starting new search.");
		process.start();
	}

}
	

function ProcessResults (err, data, response) 
{
	if( err ) console.error(err);

	if( data.statuses.length == 0 )
	{
		console.log( "Empty response.");
		console.log( response.headers );
		process.onDone();
		return;
	}

	var lastId = data.statuses[data.statuses.length-1].id_str;
	var firstId = data.statuses[0].id_str;
	console.log(firstId,lastId);
	if(lastId != null)
		last_tag = lastId; 
	
	//console.log( _.keys(allStatuses).length, JSON.stringify(data.search_metadata, 3, null) );
	// make sure lastId isn't null, doesn't want to lose track of it.
	// Write out lastId


	//allStatuses.push.apply(allStatuses, data.statuses);
	for( var i = 0; i < data.statuses.length; i++ )
	{
		var s = data.statuses[i];
		allStatuses[s.id_str] = s;
	}

	if( _.keys(allStatuses).length >= total  )
	{
		console.log("max:", data.search_metadata.max_id, "first:", firstId, "last:", lastId);
		process.onDone();
	}
	else
	{
		// Play with setting bigger time out.
		// 450 requests per 15 minutes.
		// currently: 60 per minute * 15 > 450
		setTimeout(function() {process.searchTweetsSince(tag, parseInt(lastId));}, 2500);
	}
}
