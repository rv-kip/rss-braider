// Put the description into content:encoded block
// Ex:
//  <content:encoded>
//      <![CDATA[<p>Stewart let the news slip during a taping of his show today.]]>
//  </content:encoded>
module.exports = function (item, itemOptions) {
    if (!item || !itemOptions) {
        return;
    }
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