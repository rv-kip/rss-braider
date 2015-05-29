[![Build Status](https://travis-ci.org/KQED/rss-braider.svg?branch=master)](https://travis-ci.org/KQED/rss-braider)

## Summary
Braid/aggregate one or more RSS feeds (file or url) into a single feed (RSS or JSON output). Process resulting feed through specified plugins.

## Installation
```
npm install rss-braider
```
## Test
`npm test`

## Examples
```
$ cd examples
$ node simple.js (combines 3 sources)
$ node plugins.js (combines 3 sources and runs a transformation plugin)
```
## Code Example
```js
var RssBraider = require('rss-braider'),
    feed_obj = {};

// Build feed options
feed_obj.filefeed = require("./config/feed").feed;
var braider_options = {
    feeds           : feed_obj,
    indent          : "    ",
    date_sort_order : "desc" // Newest first
};
var rss_braider = RssBraider.createClient(braider_options);

// braid 'filefeed' sources together and output in RSS format
rss_braider.processFeed('filefeed', 'rss', function(err, data){
    if (err) {
        return console.log(err);
    }
    console.log(data);
});
```


