CodeMirror.remotingExecutor = function(cm, options) {

  function startsWithString(str, token) {
    return str.slice(0, token.length) == token;
  }

  var code = cm.getValue();
  var mode = cm.getMode().name;
  var url = options.url;
  jQuery.ajax({
    type : 'POST',
    url : url,
    data : {
      "mode" : mode,
      "code" : code
    },
    async : true,
    success : function(data, textStatus, jqXHR) {
      if (options.onResult) {
        var isError = startsWithString(data, "___err");
        if (isError) {
          data = data.substring("___err".length, data.length);
          options.onResult(data, true); 
        } else {
          options.onResult(data, false);
        }
      }
    },
    error : function(jqXHR, textStatus, errorThrown) {
      alert(errorThrown)
    }
  });

};
