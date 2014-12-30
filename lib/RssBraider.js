// process feed-reader item into node-rss item

var FeedParser  = require('feedparser'),
    bunyan      = require('bunyan'),
    _           = require('lodash'),
    async       = require('async'),
    request     = require('request'),
    RSS         = require('rss'),
    fs          = require('fs');


var logger;
var RssBraider = function (options) {
    this.feeds = options.feeds || null; // TOOD validate feed configs
    this.logger = logger = options.logger || bunyan.createLogger({name: 'rss-braider'});
    this.indent = options.indent || "    ";
};

RssBraider.prototype.init = function() {
    // Validate the feeds?
};

RssBraider.prototype.feedExists = function (feed_name) {
    if (this.feeds && this.feeds[feed_name]) {
        return true;
    } else {
        return false;
    }
};

RssBraider.prototype.processFeed = function(feed_name, format, callback)
{
    // DEBUG
    console.time("process");

    if (!format) {
        format = 'json';
    }
    var self = this,
        feed = this.feeds[feed_name],
        feed_articles = [];

    if (!feed || !feed.sources || feed.sources.length < 1) {
        return callback("No definition for feed name: " + feed_name);
    }

    async.each(feed.sources, function(source, callback) {
        var count = source.count || feed.default_count || 10,
            url = source.url || null,
            file_path = source.file_path || null,
            source_articles = [];

        // todo: Check if source.file is set and set up a fs stream read
        var feedparser = new FeedParser();
        if (url) {
            var req = request(url);

            // logger.info("request to", url);

            req.on('error', function (error) {
                logger.error(error);
            });

            req.on('response', function (res) {
                var stream = this;
                if (res.statusCode !== 200) {
                    return this.emit('error', new Error('Bad status code'));
                }
                stream.pipe(feedparser);
            });
        } else if (file_path) {
            // open file
            var filestream = fs.createReadStream(file_path);
            filestream.pipe(feedparser);
        } else {
            logger.error("url or file_path not defined for feed: " + source.name);
        }

        feedparser.on('error', function(error) {
            logger.error("feedparser: error", error);
        });

        // Collect the articles from this source
        feedparser.on('readable', function() {
            // This is where the action is!
            var stream = this,
                item;

            while ( item = stream.read() ) {
                // logger.info("item received", item.guid);
                // Set kqed source
                item["kqed:source"] = source.url;
                var article = self.processItem(item);
                if (article) {
                    source_articles.push(article);
                }
            }
        });

        feedparser.on("end", function(){
            // sort and de-dupe this feed's articles and push them into array
            source_articles = self.dedupe(source_articles);
            source_articles = self.date_sort(source_articles);
            source_articles = source_articles.slice(0, count);
            feed_articles = feed_articles.concat(source_articles);
            callback();
        });
    },
    function(err){
        if (err) {
            logger.error(err);
            return callback(err);
        } else {
            // Sort the stories for the source by date descending
            feed_articles = self.dedupe(feed_articles);
            feed_articles = self.date_sort(feed_articles);
            feed_articles.reverse();

            // Create new feed with these articles
            var options = {
                title               : feed.meta.title,
                site_url            : "http://www.kqed.org",
                description         : feed.meta.description,
                generator           : feed.meta.generator || 'rss-braider',
                feed_url            : feed.meta.url,
                custom_namespaces   : feed.custom_namespaces || [],
                no_cdata_fields     : feed.no_cdata_fields
            };

            var newfeed = new RSS(options, feed_articles);


            var ret_string;
            switch (format.toLowerCase()) {
                case 'json':
                    ret_string = JSON.stringify(newfeed);
                    break;
                case 'rss':
                case 'xml':
                    ret_string = newfeed.xml(self.indent);
                    break;
                default:
                    logger.error("Unknown format:", format);
                    ret_string = "{}";
            }

            return callback(null, ret_string);
        }
    });
};

// Accepts a feed-parser item and builds a node-rss itemOptions object
RssBraider.prototype.processItem = function (item) {
    if (!item) {
        logger.error("processItem: no item passed in");
        return null;
    }
    // Basics
    var itemOptions = {
        title           : item.title,
        description     : item.summary,
        url             : item.link,
        guid            : item.guid,
        permalink       : item.permalink,
        author          : item.author,
        date            : item.date,
        categories      : item.categories,
        custom_elements : []
    };


    //////////////////
    // Custom elements    Move to PLUGINS
    //////////////////

    // kqed source
    if (item['kqed:source']) {
        itemOptions.custom_elements.push(
            { 'kqed:source': item['kqed:source'] }
        );
    }

    // content:encoded (i.e. description)
    if (item["content:encoded"] && item["content:encoded"]["#"]){
        var content_encoded = item["content:encoded"]["#"];
        itemOptions.custom_elements.push(
            { "content:encoded":
                {
                    _cdata: content_encoded
                }
            }
        );
    }

    // // wfw
    if (item["wfw:commentrss"] && item["wfw:commentrss"]["#"]){
        itemOptions.custom_elements.push({ "wfw:commentRss": item["wfw:commentrss"]["#"]});
    }

    // // // slash comments
    if (item["slash:comments"] && item["slash:comments"]["#"]){
        itemOptions.custom_elements.push({ "slash:comments": item["slash:comments"]["#"]});
    }

    // Images
    // Take 'media:thumbnail',
    //       else
    //      'media:content'[0]'media:thumbnail'
    //       else
    //      'media:thumbnail'
    var thumbnail;
    if (item['media:thumbnail'] && item['media:thumbnail']['#']) {
        thumbnail = {
            'media:thumbnail': item['media:thumbnail']['#']
        };
        itemOptions.custom_elements.push(thumbnail);
    } else {
        if (item["media:content"]) {
            var media_contents;
            if (! _.isArray(item['media:content'])) {
                media_contents = [item['media:content']];
            } else {
                media_contents = item['media:content'];
            }

            if ( media_contents[0] &&
                 media_contents[0]['media:thumbnail'] &&
                 media_contents[0]['media:thumbnail']['@'] &&
                 media_contents[0]['media:thumbnail']['@'].url) {

                thumbnail = {
                    'media:thumbnail' : [{
                        _attr: {
                            url: media_contents[0]['media:thumbnail']['@'].url
                        }
                    }]
                };
                // itemOptions.custom_elements.push({'media:thumbnail' : { url: media_contents[0]['media:thumbnail']['@'].url}} );
                itemOptions.custom_elements.push(thumbnail);
            } else {
                thumbnail = {
                    'media:thumbnail' : [{
                        _attr: {
                            url: media_contents[0]['@'].url
                        }
                    }]
                };
                itemOptions.custom_elements.push(thumbnail);
            }
        }
    }

    return itemOptions;
};

// Dedupe articles in node-rss itemOptions format
RssBraider.prototype.dedupe = function(articles_arr){
    // TODO: sort by guid, url, etc
    return _.uniq(articles_arr);
};

RssBraider.prototype.date_sort = function(articles_arr) {
    var sorted_articles = _.sortBy(articles_arr, function(article) {
        return article.date.getTime();
    });
    return sorted_articles;
};

module.exports = RssBraider;