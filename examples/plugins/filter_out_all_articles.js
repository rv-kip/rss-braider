module.exports = function (item, itemOptions, source) {
    if (!item || !itemOptions) {
        return;
    }

    // This plugin removes all items by returning -1 instead of the processed itemOptions
    return -1;
};