var RssBraider = require('../index'),
    feed_obj = {};

feed_obj.filefeed = require("./config/feed").feed;
var braider_options = {
    feeds           : feed_obj,
    indent          : "    ",
    date_sort_order : "desc" // Newest first
};
var rss_braider = RssBraider.createClient(braider_options);

rss_braider.processFeed('filefeed', 'rss', function(err, data){
    if (err) {
        return console.log(err);
    }
    console.log(data);
});