var parseUri = require("./parse_uri.js");

var allowedGoogleParameters = ["q", "start"];

var process = function(referer){
  var parsedUri = parseUri.parse(referer);
  
  if(parsedUri.protocol != 'http' && parsedUri.protocol != 'https'){
    return null;
  }

  // If the host of the referer is Facebook or Facebook Mobile,
  // ignore the rest of the URL
  if((parsedUri.host == 'www.facebook.com') || (parsedUri.host == 'm.facebook.com')){
    return parsedUri.protocol + "://" + parsedUri.host
  } else if((parsedUri.host == 't.co') || (parsedUri.host == 'twitter.com' && parsedUri.path == '')){
    return parsedUri.protocol + "://www.twitter.com"
  } else if(parsedUri.host.indexOf('google') != -1){
    // Process parameters of Google query to get an unique
    // url for the result
    var query_parameters = parsedUri.query.split("&"),
        new_query_parameters = [],
        new_path;
    if(parsedUri.path == '/url') {
      new_path = '/search';
    } else {
      new_path = parsedUri.path;
    }
    for(var i = 0;i < query_parameters.length; i++){
      var parameter = query_parameters[i].split("=");
      if(allowedGoogleParameters.indexOf(parameter[0]) != -1){
        new_query_parameters.push(query_parameters[i]);
      }
    }
    return parsedUri.protocol + "://" + parsedUri.host + new_path + '?' + new_query_parameters.join("&");
  }
  return referer;
}
exports.process = process;