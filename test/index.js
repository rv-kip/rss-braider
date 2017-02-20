var test = require('tape'),
    RssBraider = require('../index'),
    includeFolder = require('include-folder'),
    expectedOutput = includeFolder(__dirname + '/expected_output', /.*\.xml$/);

// lastBuildDate will always be this value
var mockdate = require('mockdate').set('Wed, 31 Dec 2014 00:00:01 GMT');

test('generate feed. No plugins', function(t) {
    t.plan(1);
    var feeds = {};
    feeds.sample_feed = require("./feeds/sample_feed").feed;
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

test('generate feed and process through plugins', function(t) {
    t.plan(1);
    var feeds = {};
    feeds.sample_feed = require("./feeds/sample_feed_plugins").feed;
    var braider_options = {
        feeds                   : feeds,
        indent                  : "    ",
        date_sort_order         : "desc",
        plugins_directories     : [__dirname + '/../examples/plugins/']
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
test('de-duplicate feed', function(t) {
    t.plan(1);
    var feeds = {};
    feeds.sample_feed = require("./feeds/sample_feed_duplicates").feed;
    var braider_options = {
        feeds                   : feeds,
        indent                  : "    ",
        dedupe_fields           : ["title", "guid"],
        plugins_directories     : [__dirname + '/../examples/plugins/']
    };
    var rss_braider = RssBraider.createClient(braider_options);
    rss_braider.logger.level('info');

    rss_braider.processFeed('sample_feed', 'rss', function(err, data){
        if (err) {
            return t.fail(err);
        }
        // console.log(data);
        t.equal(data, expectedOutput.fileFeedOutputPlugins);
    });
});

test('sort feed articles by date descending', function(t) {
    t.plan(1);
    var feeds = {};
    feeds.sample_feed = require("./feeds/date_sort").feed;
    var braider_options = {
        feeds                   : feeds,
        indent                  : "    ",
        date_sort_order         : "desc",
        plugins_directories     : [__dirname + '/../examples/plugins/']
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

test('sort feed articles by date ascending', function(t) {
    t.plan(1);
    var feeds = {};
    feeds.sample_feed = require("./feeds/date_sort").feed;
    var braider_options = {
        feeds                   : feeds,
        indent                  : "    ",
        date_sort_order         : "asc",
        plugins_directories     : [__dirname + '/../examples/plugins/']
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

test('filter all articles out using plugin', function(t) {
    t.plan(1);
    var feeds = {};
    feeds.sample_feed = require("./feeds/no_elements").feed;
    var braider_options = {
        feeds                   : feeds,
        indent                  : "    ",
        date_sort_order         : "asc",
        plugins_directories     : [__dirname + '/../examples/plugins/']
    };
    var rss_braider = RssBraider.createClient(braider_options);
    rss_braider.logger.level('info');

    rss_braider.processFeed('sample_feed', 'rss', function(err, data){
        if (err) {
            return t.fail(err);
        }
        // console.log(data);
        t.equal(data, expectedOutput.emptyFeed);
    });
});

test("Don't break when a filter fails and returns null", function(t) {
    t.plan(1);
    var feeds = {};
    feeds.sample_feed = require("./feeds/sample_feed_bad_plugin").feed;
    var braider_options = {
        feeds                   : feeds,
        indent                  : "    ",
        date_sort_order         : "asc",
        plugins_directories     : [__dirname + '/../examples/plugins/']
    };
    var rss_braider = RssBraider.createClient(braider_options);
    rss_braider.logger.level('info');

    rss_braider.processFeed('sample_feed', 'rss', function(err, data){
        if (err) {
            return t.fail(err);
        }
        // console.log(data);
        t.equal(data, expectedOutput.fileFeedBadPlugin);
    });
});
