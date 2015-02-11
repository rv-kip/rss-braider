var feed = {
    "feed_name"         : "feed with plugins",
    "default_count"     : 1,
    "no_cdata_fields"   : [],
    "plugins"           : ['content_encoded'],
    "meta" : {
        "title": "NPR Braided Feed",
        "description": "This is a test of two NPR sources from file. Plugins are applied."
    },
    'custom_namespaces'   : {
        "slash"     : "http://purl.org/rss/1.0/modules/slash/",
        "media"     : "http://search.yahoo.com/mrss/",
        "ev"        : "http://purl.org/rss/2.0/modules/event/",
        "sy"        : "http://purl.org/rss/1.0/modules/syndication/",
        "wfw"       : "http://wellformedweb.org/CommentAPI/",
    },
    "sources" : [
        {
            "name"              : "NPR",
            "count"             : 1,
            "file_path"         : __dirname + "/../feed_xml/npr.xml",
        },
        {
            "name"              : "NPR Health",
            "count"             : 1,
            "file_path"         : __dirname + "/../feed_xml/npr_health.xml",
        }
    ]
};
exports.feed = feed;