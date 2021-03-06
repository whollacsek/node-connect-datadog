var DD = require("node-dogstatsd").StatsD;

module.exports = function (options) {
  var datadog = options.dogstatsd || new DD();
  var stat = options.stat || "node.express.router";
  var tags = options.tags || [];
  var path = options.path || false;
  var base_url = options.base_url || false;
  var response_code = options.response_code || false;
  var statsCallback = options.statsCallback || false;
  var sampleRate = options.sampleRate || 1;

  return function (req, res, next) {
    if (!req._startTime) {
      req._startTime = new Date();
    }

    var end = res.end;
    res.end = function (chunk, encoding) {
      res.end = end;
      res.end(chunk, encoding);

      if (!req.route || !req.route.path) {
        return;
      }

      var baseUrl = (base_url !== false) ? req.baseUrl : '';
      var statTags = [
        "route:" + baseUrl + req.route.path
      ].concat((typeof tags === 'function') ? tags(req, res) : tags);

      if (options.method) {
        statTags.push("method:" + req.method.toLowerCase());
      }

      if (options.protocol && req.protocol) {
        statTags.push("protocol:" + req.protocol);
      }

      if (path !== false) {
        statTags.push("path:" + baseUrl + req.path);
      }

      if (response_code) {
        statTags.push("response_code:" + res.statusCode);
        datadog.increment(stat + '.response_code.' + res.statusCode , sampleRate, statTags);
        datadog.increment(stat + '.response_code.all', sampleRate, statTags);
      }

      datadog.histogram(stat + '.response_time', (new Date() - req._startTime), sampleRate, statTags);

      if (statsCallback && typeof statsCallback === 'function') {
        statsCallback(datadog, stat, sampleRate, statTags, req, res);
      }
    };

    next();
  };
};
