var RssBraider = require('../index'),
    feeds = {};

// Pull feeds from config files:
//      feeds.simple_test_feed = require("./config/feed").feed;
// Or define in-line
feeds.simple_test_feed = {
    "feed_name"             : "feed",
    "default_count"         : 1,
    "no_cdata_fields"       : [], // Don't wrap these fields in CDATA tags
    "meta" : {
        "title": "NPR Braided Feed",
        "description": "This is a test of two NPR"
    },
    "sources" : [
        {
            "name"              : "NPR Headlines",
            "count"             : 2,
            "feed_url"          : "http://www.npr.org/rss/rss.php?id=1001",
        },
        {
            "name"              : "NPR Sports",
            "count"             : 2,
            "feed_url"          : "http://www.npr.org/rss/rss.php?id=1055"
        }
    ]
};
var braider_options = {
    feeds           : feeds,
    indent          : "    ",
    date_sort_order : "desc", // Newest first
    log_level       : 'debug'
};
var rss_braider = RssBraider.createClient(braider_options);

// Set logging level (debug, info, warn, err, off)
rss_braider.logger.level('off');

rss_braider.processFeed('simple_test_feed', 'rss', function(err, data){
    if (err) {
        return console.log(err);
    }
    console.log(data);
});