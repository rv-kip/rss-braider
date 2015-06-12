var feed = {
    "feed_name"         : "no_elements",
    // "plugins"           : ['bad_plugin'], // Intentionally bad plugin for testing
    "meta" : {
        "title"         : "A Feed with no elements",
        "description"   : "This feed will have no elements as a result of the filter_all_articles plugin. Used for unit tests.",
        "url"           : "http://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
    },
    "sources" : [
        {
            "name"              : "sample_source",
            "count"             : 3,
            "file_path"         : __dirname + "/../input_files/sample_feed.xml",
        }
    ]
};
exports.feed = feed;