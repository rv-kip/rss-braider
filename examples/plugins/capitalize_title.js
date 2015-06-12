module.exports = function (item, itemOptions, source) {
    if (itemOptions.title) {
        itemOptions.title = itemOptions.title.toUpperCase();
    }

    return itemOptions;
};