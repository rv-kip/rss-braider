// Add a media:thumbnail element
// Take 'media:thumbnail',
//       else
//      'media:content'[0]'media:thumbnail'
//       else
//      'media:thumbnail'
var _ = require('lodash');
module.exports = function (item, itemOptions) {
    if (!item || !itemOptions) {
        return;
    }

    var thumbnail;
    if (item['media:thumbnail'] && item['media:thumbnail']['#']) {
        thumbnail = {
            'media:thumbnail': item['media:thumbnail']['#']
        };
        itemOptions.custom_elements.push(thumbnail);
    } else {
        if (item["media:content"]) {
            var media_contents;
            if (! _.isArray(item['media:content'])) {
                media_contents = [item['media:content']];
            } else {
                media_contents = item['media:content'];
            }

            if ( media_contents[0] &&
                 media_contents[0]['media:thumbnail'] &&
                 media_contents[0]['media:thumbnail']['@'] &&
                 media_contents[0]['media:thumbnail']['@'].url) {

                thumbnail = {
                    'media:thumbnail' : [{
                        _attr: {
                            url: media_contents[0]['media:thumbnail']['@'].url
                        }
                    }]
                };
                // itemOptions.custom_elements.push({'media:thumbnail' : { url: media_contents[0]['media:thumbnail']['@'].url}} );
                itemOptions.custom_elements.push(thumbnail);
            } else {
                thumbnail = {
                    'media:thumbnail' : [{
                        _attr: {
                            url: media_contents[0]['@'].url
                        }
                    }]
                };
                itemOptions.custom_elements.push(thumbnail);
            }
        }
    }
};