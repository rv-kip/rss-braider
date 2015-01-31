module.exports = function (item, itemOptions) {
    if (!item || !itemOptions) {
        return;
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
};