var RssBraider = require('../index'),
    feeds = {};
feeds.filefeed = require("./filefeed").feed;
var braider_options = {
    feeds       : feeds,
    indent      : "    "
};
var rss_braider = RssBraider.createClient(braider_options);

rss_braider.processFeed('filefeed', 'rss', function(err, data){
    if (err) {
        return console.log(err);
    }
    console.log(data);
});