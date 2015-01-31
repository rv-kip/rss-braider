var test = require('tape'),
    RssBraider = require('../index'),
    includeFolder = require('include-folder'),
    expectedOutput = includeFolder(__dirname + '/expected_output', /.*\.xml$/);

// lastBuildDate will always be this value
var mockdate = require('mockdate').set('Wed, 31 Dec 2014 00:00:01 GMT');

test('braid feed from file without plugins', function(t) {
    t.plan(1);
    var feeds = {};
    feeds.sample_feed = require("./input_files/sample_feed").feed;
    var braider_options = {
        feeds           : feeds,
        indent          : "    ",
        date_sort_order : "desc"
    };
    var rss_braider = RssBraider.createClient(braider_options);

    rss_braider.processFeed('sample_feed', 'rss', function(err, data){
        if (err) {
            return t.fail(err);
        }
        // console.log(data);
        t.equal(data, expectedOutput.fileFeedOutput);

    });
});

test('braid feed from file with plugins', function(t) {
    t.plan(1);
    var feeds = {};
    feeds.sample_feed = require("./input_files/sample_feed_plugins").feed;
    var braider_options = {
        feeds           : feeds,
        indent          : "    ",
        date_sort_order : "desc"
    };
    var rss_braider = RssBraider.createClient(braider_options);

    rss_braider.processFeed('sample_feed', 'rss', function(err, data){
        if (err) {
            return t.fail(err);
        }
        // console.log(data);
        t.equal(data, expectedOutput.fileFeedOutputPlugins);

    });
});
test('deduplicate feed from file', function(t) {
    t.plan(1);
    var feeds = {};
    feeds.sample_feed = require("./input_files/sample_feed_duplicates").feed;
    var braider_options = {
        feeds           : feeds,
        indent          : "    ",
        dedupe_fields   : ["title", "guid"]
    };
    var rss_braider = RssBraider.createClient(braider_options);

    rss_braider.processFeed('sample_feed', 'rss', function(err, data){
        if (err) {
            return t.fail(err);
        }
        // console.log(data);
        t.equal(data, expectedOutput.fileFeedOutputPlugins);
    });
});

test('sort by date desc', function(t) {
    t.plan(1);
    var feeds = {};
    feeds.sample_feed = require("./input_files/date_sort").feed;
    var braider_options = {
        feeds           : feeds,
        indent          : "    ",
        date_sort_order : "desc"
    };
    var rss_braider = RssBraider.createClient(braider_options);

    rss_braider.processFeed('sample_feed', 'rss', function(err, data){
        if (err) {
            return t.fail(err);
        }
        // console.log(data);
        t.equal(data, expectedOutput.dateDescOutput);
    });
});

test('sort by date asc', function(t) {
    t.plan(1);
    var feeds = {};
    feeds.sample_feed = require("./input_files/date_sort").feed;
    var braider_options = {
        feeds           : feeds,
        indent          : "    ",
        date_sort_order : "asc"
    };
    var rss_braider = RssBraider.createClient(braider_options);

    rss_braider.processFeed('sample_feed', 'rss', function(err, data){
        if (err) {
            return t.fail(err);
        }
        // console.log(data);
        t.equal(data, expectedOutput.dateAscOutput);
    });
});


