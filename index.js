var RssBraider = require('./lib/RssBraider');

exports.createClient = function (options) {
    return new RssBraider(options);
};
exports.RssBraider = RssBraider;
