module.exports = function (item, itemOptions) {
    if (!item || !itemOptions) {
        return;
    }

     // 'itunes:summary':
     //  { '@': {},
     //    '#': 'Let KQED Arts help you find the best things to see, do, and explore in San Francisco, Oakland, San Jose, and the surrounding areas.' },
     // 'itunes:author': { '@': {}, '#': 'KQED Arts' },
     // 'itunes:explicit': { '@': {}, '#': 'no' },
     // 'itunes:image': { '@': [Object] },
     // 'itunes:owner': { '@': {}, 'itunes:name': [Object], 'itunes:email': [Object] },
     // 'rss:managingeditor':
     //  { '@': {},
     //    '#': 'ondemand@kqed.org (KQED Arts)',
     //    name: 'KQED Arts',
     //    email: 'ondemand@kqed.org' },
     // 'rss:copyright':
     //  { '@': {},
     //    '#': 'Copyright © 2015 KQED Inc. All Rights Reserved.' },
     // 'itunes:subtitle': { '@': {}, '#': 'KQED Public Media for Northern CA' },
     // 'rss:image': { '@': {}, title: [Object], url: [Object], link: [Object] },
     // 'itunes:category': [ [Object], [Object], [Object] ],

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
// <copyright>Copyright © 2015 KQED Inc. All Rights Reserved.</copyright>
// <itunes:subtitle>KQED Public Media for Northern CA</itunes:subtitle>

// *link
// *comments
// pubDate
// *dc:creator
// *category
// guid
// description
// *content:encoded
// *wfw:commentRss
// *slash:comments
// enclosure
// itunes:subtitle
// itunes:summary
// itunes:author
// itunes:explicit
// *media:content (multiple)
// *media:thumbnail

    // Pass through itunes content
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
};