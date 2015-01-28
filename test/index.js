// prova is a wrapper for tape
// use npm run test:browser to run tests in a browser
var test = require('tape'),
    RssBraider = require('../index'),
    includeFolder = require('include-folder'),
    expectedOutput = includeFolder(__dirname + '/expected_output', /.*\.xml$/);

// lastBuildDate will always be this value
var mockdate = require('mockdate').set('Wed, 31 Dec 2014 00:00:01 GMT');

test('braid feed from file', function(t) {
    t.plan(1);
    var feeds = {};
    feeds.sample_feed = require("./input_files/sample_feed").feed;
    var braider_options = {
        feeds       : feeds,
        indent      : "    "
    };
    var rss_braider = RssBraider.createClient(braider_options);

    rss_braider.processFeed('sample_feed', 'rss', function(err, data){
        if (err) {
            return t.fail(err);
        }
        t.equal(data, expectedOutput.fileFeedOutput);
    });
});
