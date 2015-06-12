[![Build Status](https://travis-ci.org/KQED/rss-braider.svg?branch=master)](https://travis-ci.org/KQED/rss-braider)

## Summary
Braid/aggregate one or more RSS feeds (file or url) into a single feed (RSS or JSON output). Process resulting feed through specified plugins. Automatic deduplication

## Installation
```
npm install rss-braider
```
## Test
`npm test`

## Examples
```
$ cd examples
$ node simple.js  (combines 3 sources)
$ node plugins.js (combines 3 sources and runs a transformation plugin)
```
### Code Example
```js
var RssBraider = require('rss-braider'),
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
    log_level       : "debug"
};
var rss_braider = RssBraider.createClient(braider_options);

// Override logging level (debug, info, warn, err, off)
rss_braider.logger.level('off');

// Output braided feed as rss. use 'json' for JSON output.
rss_braider.processFeed('simple_test_feed', 'rss', function(err, data){
    if (err) {
        return console.log(err);
    }
    console.log(data);
});
```
## Plugins
Plugins provide custom manipulation and filtering of RSS items/articles. See `lib/example_plugins` for examples. A plugin operates by modifying the itemOptions object or by returning `null` which will exclude the `item` (article) from the resulting feed.

### Plugin Example
This plugin will capitalize the article title for all articles
```js
module.exports = function (item, itemOptions, source) {
    if (!item || !itemOptions) {
        return;
    }


    if (itemOptions.title) {
        itemOptions.title = itemOptions.title.toUpperCase();
    }

    return itemOptions;
};
```


