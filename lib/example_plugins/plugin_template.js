module.exports = function (item, itemOptions, source) {
    if (!item || !itemOptions) {
        return;
    }

    // This plugin does no processing
    // It's just a template

    return itemOptions;
};