// define kqed source
module.exports = function (item, itemOptions, source) {
    // Look for kqed namespace elements in source and add as custom elements for item
    // Ex:
    // <kqed:fullname>The California Report</kqed:fullname>
    // <kqed:shortname>the-california-report</kqed:shortname>
    // <kqed:site_url>
    //     http://ww2.kqed.org/news/programs/the-california-report
    // </kqed:site_url>
    var element;
    if (source.site_url){
        element = {
            'kqed:site_url': source.site_url
        };
        itemOptions.custom_elements.push(element);
    }

    if (source.fullname){
        element = {
            'kqed:fullname': source.fullname
        };
        itemOptions.custom_elements.push(element);
    }
    // add shortname using the source 'name'
    element = {
        'kqed:shortname': source.name
    };
    itemOptions.custom_elements.push(element);

    // Add the source's feed url to the kqed namespace of the item/article
    if (item.feed_url) {
        itemOptions.custom_elements.push(
            { 'kqed:feed_url': item.feed_url }
        );
    }
    return itemOptions;
};