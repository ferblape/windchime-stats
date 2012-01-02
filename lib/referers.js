var parseUri = require("./parse_uri.js");

var excludeGoogleParameters = ["ei", "ved"];

var process = function(referer){
  var parsedUri = parseUri.parse(referer);

  // If the host of the referer is Facebook or Facebook Mobile,
  // ignore the rest of the URL
  if((parsedUri.host == 'www.facebook.com') || (parsedUri.host == 'm.facebook.com')){
    return parsedUri.host
  } else if(parsedUri.host.indexOf('google') != -1){
    // Process parameters of Google query to get an unique
    // url for the result
    var query_parameters = parsedUri.query.split("&");
    var new_query_parameters = [];
    for(var i = 0;i < query_parameters.length; i++){
      var parameter = query_parameters[i].split("=");
      if(excludeGoogleParameters.indexOf(parameter[0]) == -1){
        new_query_parameters.push(query_parameters[i]);
      }
    }
    return "http://" + parsedUri.host + parsedUri.path + '?' + new_query_parameters.join("&");
  }
  return referer;
}
exports.process = process;