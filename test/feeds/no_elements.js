var feed = {
    "feed_name"         : "no_elements",
    "plugins"           : ['filter_out_all_articles'], // No articles make it through
    "meta" : {
        "title"         : "A Feed with no elements",
        "description"   : "This feed will have no elements as a result of the filter_all_articles plugin. Used for unit tests.",
        "url"           : "http://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
    },
    "sources" : [
        {
            "name"              : "nyt_tech",
            "feed_url"          : "http://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
            "count"             : 5,
            "fullname"          : "NYT Technology"
        }
    ]
};
exports.feed = feed;