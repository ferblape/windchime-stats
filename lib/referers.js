var parseUri = require("./parse_uri.js");

// If the host of the referer is Facebook or Facebook Mobile,
// ignore the rest of the URL
var process = function(referer){
  var parsedUri = parseUri.parse(referer);
  if((parsedUri.host == 'www.facebook.com') || (parsedUri.host == 'm.facebook.com')){
    return parsedUri.host
  }
  return referer;
}
exports.process = process;