var feed = {
    "feed_name"         : "feed",
    "default_count"     : 1,
    "no_cdata_fields"  : [],
    "meta" : {
        "title": "NPR Braided Feed",
        "description": "This is a test of two NPR sources from file"
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