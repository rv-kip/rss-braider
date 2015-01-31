var feed = {
    "feed_name"         : "test file feed",
    "default_count"     : 1,
    "no_cdata_fields"  : ['description'],
    "meta" : {
        "title": "Test File Feed",
        "description": "This feed comes from a file",
        // "url": "http://example.com/feed/",
    },
    'custom_namespaces'   : {
    },
    "sources" : [
        {
            "name"              : "file",
            "count"             : 1,
            "file_path"         : __dirname + "/feed_source.xml",
        },

    ]
};
exports.feed = feed;