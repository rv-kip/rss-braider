module.exports = function (item, itemOptions, source) {
    if (!item || !itemOptions) {
        return;
    }

    // This plugin removes all items by returning null instead of the processed
    // itemOptions
    return null;
};