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
    this.feeds = options.feeds || null;
    this.logger = logger = options.logger || bunyan.createLogger({name: 'rss-braider'});
    this.indent = options.indent || "    ";
    this.dedupe_fields = options.dedupe_fields || []; // The fields to use to identify duplicate articles
    this.date_sort_order = options.date_sort_order || "desc";
    this.plugins_directories = options.plugins_directories || [];
    // load plugins from plugins folder
    // TODO, specify plugins location
    this.plugins = {};
    this.loadPlugins();

};

// loadup self.plugins with the plugin functions
RssBraider.prototype.loadPlugins = function () {
    var self = this;

    if (self.plugins_directories.length < 1) {
        // logger.info("No plugins_directories specified. No plugins loaded.");
    }
    self.plugins_directories.forEach(function(path){
        // load up each file and assign it to the plugins
        var filenames = fs.readdirSync(path);
        filenames.forEach(function(filename){
            var plugin_name = filename.replace(/.js$/, '');
            if (self.plugins[plugin_name]) {
                logger.warn("Duplicate plugin name: ", plugin_name, "Overwriting with newer plugin");
            }
            self.plugins[plugin_name] = require(path + '/' + plugin_name);
            // logger.info("plugin registered:", plugin_name);
        });
    });
};

RssBraider.prototype.feedExists = function (feed_name) {
    if (this.feeds && this.feeds[feed_name]) {
        return true;
    } else {
        return false;
    }
};

// Gather data from all feed sources, process each article/item through plugins,
// trim down to  desired count, dedupe and sort
RssBraider.prototype.processFeed = function(feed_name, format, callback)
{
    if (!format) {
        format = 'rss';
    }
    var self = this,
        feed = self.feeds[feed_name],
        feed_articles = [];

    // logger.info("DEBUG processFeed: feed is set to " + feed_name);

    if (!feed || !feed.sources || feed.sources.length < 1) {
        return callback("No definition for feed name: " + feed_name);
    }

    async.each(feed.sources, function(source, callback) {
        var count = source.count || feed.default_count || 10, // Number of articles
            url = source.feed_url || null,
            file_path = source.file_path || null,
            source_articles = [];

        // logger.debug("Requesting source:" + source.name + " at " + url + " for feed:" + feed_name);
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
                    return this.emit('error', 'Bad status code: ' + res.statusCode);
                }
                stream.pipe(feedparser);
            });
        } else if (file_path) {
            // open file
            var filestream = fs.createReadStream(file_path);
            filestream.pipe(feedparser);
        } else {
            logger.error("url or file_path not defined for feed: " + source.name);
            return callback();
        }

        feedparser.on('error', function(error) {
            logger.error("feedparser error:", error, "name:", source.name, "source:", source.feed_url);
        });

        // Collect the articles from this source
        feedparser.on('readable', function() {
            // This is where the action is!
            var stream = this,
                item;

            while ( item = stream.read() ) {
                if (source.feed_url) {
                    item.source_url = source.feed_url;
                }
                // Process Item/Article
                var article = self.processItem(item, source, feed_name);
                if (article) {
                    source_articles.push(article);
                }
            }
        });

        feedparser.on("end", function(){
            // sort and de-dupe this feed's articles and push them into array
            source_articles = self.dedupe(source_articles, self.dedupe_fields);
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
            // Final Dedupe step and resort
            feed_articles = self.dedupe(feed_articles, self.dedupe_fields);
            feed_articles = self.date_sort(feed_articles);

            // Create new feed with these articles
            var options = {
                title               : feed.meta.title,
                description         : feed.meta.description,
                generator           : feed.meta.generator || 'rss-braider',
                site_url            : feed.meta.site_url || null,
                feed_url            : feed.meta.feed_url || null,
                image_url           : feed.meta.image_url || null,
                webMaster           : feed.meta.webMaster || null,
                copyright           : feed.meta.copyright || null,
                categories          : feed.meta.categories || null,
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
RssBraider.prototype.processItem = function (item, source, feed_name) {
    var self = this;

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

    // Run the plugins specified by the "plugins" section of the
    // feed config file to build out any custom elements or
    // do transforms
    itemOptions = self.runPlugins(item, itemOptions, source, feed_name);

    return itemOptions;
};

RssBraider.prototype.runPlugins = function (item, itemOptions, source, feed_name) {
    var self = this,
        feed = self.feeds[feed_name] || {},
        plugins_list = feed.plugins || [],
        ret_val;
    // Process the item through the desired feed plugins
    // plugins_list.forEach(function(plugin_name){
    for (var i = 0; i < plugins_list.length; i++) {
        var plugin_name = plugins_list[i];
        if (self.plugins[plugin_name]) {
            // logger.info("DEBUG runPlugins running " + plugin_name + " for item " + item.guid + " in feed: " + feed.meta.title);
            itemOptions = self.plugins[plugin_name](item, itemOptions, source);
        } else {
            logger.error("A plugin named '" + plugin_name + "' hasn't been registered");
        }

        // If itemOptions comes back null, skip this item
        // as one of the plugins decided to toss it
        if (itemOptions === null) {
            // logger.info("Plugin rejected item", plugin_name, item.guid, feed.meta.title);
            break;
        } else {
            // logger.info("Plugin completed", plugin_name, item.guid, feed.meta.title);
        }
    }
    return itemOptions;
};

// Dedupe articles in node-rss itemOptions format
// Accepts an array of fields to dedupe on, or does a basic uniq
// operation on the articles array
// TODO, make this a plugin?
RssBraider.prototype.dedupe = function(articles_arr, fields){
    if ( !fields || fields.length < 1 ) {
        return _.uniq(articles_arr);
    } else {
        var uniques = {},
            deduped_articles = [];
        articles_arr.forEach(function(article){
            var count = 0;
            fields.forEach(function(field){
                if (!uniques[field]) {
                    uniques[field] = [];
                }
                if (uniques[field].indexOf(article[field]) !== -1) {
                    count++;
                } else {
                    uniques[field].push(article[field]);
                }
            });
            if (count !== fields.length) {
                // it's unique
                deduped_articles.push(article);
            } else {
                // The article matched all of another article's fields
                // Do nothing
            }
        });
        return deduped_articles;
    }
};

// TODO: Could be a plugin
// Sort articles by date
RssBraider.prototype.date_sort = function(articles_arr) {
    var sorted_articles = _.sortBy(articles_arr, function(article) {
        return article.date.getTime();
    });
    if (this.date_sort_order === "desc") {
        sorted_articles.reverse();
    }
    return sorted_articles;
};

module.exports = RssBraider;