$(document).ready(function() {
   $('pre[data-src]').each(function() {
    var pre = $(this),
        url = $(this).attr('data-src');
      $.ajax({
        url : url,
        dataType: "text",
        success : function (data) {
          var lang;

          switch(url.split('.').pop()) {
            case 'js':
              lang = "javascript";
              break;
            case 'css':
            case 'sass':
              lang = "css";
              break;

            case 'html':
              lang = "html";
              data = data.replace(/</g, '&lt;');
              data = data.replace(/>/g, '&gt;');
              break;
          }

          pre.html('<code class="' + lang + ' hljs">' + data + '</code>');
          hljs.highlightBlock(pre.find('code').get(0));
        }
      });
   });
}); 