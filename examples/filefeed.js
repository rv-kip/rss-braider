var feed = {
    "feed_name"         : "test file feed",
    "default_count"     : 1,
    "no_cdata_fields"  : ['description'],
    "plugins"           : ['kqed', 'content_encoded', 'wfw_slash_comments', 'add_media_thumbnail'],
    "meta" : {
        "title": "Test File Feed",
        "description": "This feed comes from a file",
        // "url": "http://example.com/feed/",
    },
    'custom_namespaces'   : {
        "slash"     : "http://purl.org/rss/1.0/modules/slash/",
        "media"     : "http://search.yahoo.com/mrss/",
        "ev"        : "http://purl.org/rss/2.0/modules/event/",
        "sy"        : "http://purl.org/rss/1.0/modules/syndication/",
        "wfw"       : "http://wellformedweb.org/CommentAPI/",
        "kqed"      : "http://www.kqed.org"
    },
    "sources" : [
        {
            "name"              : "file",
            "count"             : 1,
            "file_path"         : __dirname + "/filefeed.xml",
            "categories"        : ['something can go here']
        },

    ]
};
exports.feed = feed;