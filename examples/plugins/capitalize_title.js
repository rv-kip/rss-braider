module.exports = function (item, itemOptions, source) {
    if (!item || !itemOptions) {
        return;
    }

    if (itemOptions.title) {
        itemOptions.title = itemOptions.title.toUpperCase();
    }

    return itemOptions;
};