module.exports = function (item, itemOptions, source) {
    // wfw
    if (item["wfw:commentrss"] && item["wfw:commentrss"]["#"]){
        itemOptions.custom_elements.push({ "wfw:commentRss": item["wfw:commentrss"]["#"]});
    }

    // // // slash comments
    if (item["slash:comments"] && item["slash:comments"]["#"]){
        itemOptions.custom_elements.push({ "slash:comments": item["slash:comments"]["#"]});
    }
    return itemOptions;
};