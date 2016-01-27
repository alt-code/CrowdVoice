var jsonfile = require('jsonfile');
var _ = require("underscore");

var statuses = _.values(jsonfile.readFileSync("statuses.json"));

var all = {};
var media = {}

// filter out top mentions? mashable...sort works, not for isis.

for( var i = 0; i < statuses.length; i++ )
{
	var s = statuses[i];
	all[s] = s.id_str;

	if( s.entities && s.entities.media && s.entities.media.length > 0 )
	{
		var path = s.entities.media[0].media_url;
		if( !media.hasOwnProperty(path) )
		{
			media[path] = 0;
		}
		media[path]++;
	}
}

console.log(statuses.length, _.keys(all).length, _.keys(media).length, _.max(_.values(media)) );

for( var i = 0; i < statuses.length; i++ )
{
	var s = statuses[i];
	if( s.entities && s.entities.media && s.entities.media.length > 0 )
	{
		var path = s.entities.media[0].media_url;
		if( media[path] < 5 /*&& s.text.indexOf("RT")!=0*/)
		{
			// console.log( s.text, s.retweet_count  );
		}
		console.log(s.created_at, s.id);
	}
}

// name
// screen_name
// description
// location
// profile_image_url

// text
// media.media_url
// created_at
