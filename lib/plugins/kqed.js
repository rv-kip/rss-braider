// define kqed source
module.exports = function (item, itemOptions) {
    if (!item || !itemOptions) {
        return;
    }
    if (item.source_url) {
        itemOptions.custom_elements.push(
            { 'kqed:source': item.source_url }
        );
    }
};