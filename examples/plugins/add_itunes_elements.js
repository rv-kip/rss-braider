// Pass through itunes content...
//
// <itunes:summary>
// Let KQED Arts help you find the best things to see, do, and explore in San Francisco, Oakland, San Jose, and the surrounding areas.
// </itunes:summary>
// <itunes:author>KQED Arts</itunes:author>
// <itunes:explicit>no</itunes:explicit>
// <itunes:image href="http://ww2.kqed.org/arts/wp-content/uploads/sites/2/powerpress/TDL-Logo-1400x1400.jpeg"/>
// <itunes:owner>
// <itunes:name>KQED Arts</itunes:name>
// <itunes:email>ondemand@kqed.org</itunes:email>
// </itunes:owner>
// <managingEditor>ondemand@kqed.org (KQED Arts)</managingEditor>
// <itunes:subtitle>KQED Public Media for Northern CA</itunes:subtitle>

module.exports = function (item, itemOptions, source) {
    var pass_through_arr = ['itunes:summary', 'itunes:author', 'itunes:explicit', ];
    pass_through_arr.forEach(function(element){
        if (item[element] && item[element]['#']) {
            var custom_element = {};
            custom_element[element] = item[element]['#'];
            itemOptions.custom_elements.push(custom_element);
        }
    });

    // audio enclosures
    if (item.enclosures && Array.isArray(item.enclosures)){
        item.enclosures.forEach(function(enclosure){
            if (enclosure.type === 'audio/mpeg') {
                var element = {
                    enclosure :{
                        _attr : {
                            url     : enclosure.url,
                            length  : enclosure.length || enclosure.size || 0,
                            type    : enclosure.type || mime.lookup(enclosure.url)
                        }
                    }
                };

                itemOptions.custom_elements.push(element);
            }
        });
    }
    return itemOptions;
};