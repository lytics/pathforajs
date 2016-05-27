$(document).ready(function() {
   $('pre[data-src]').each(function() {
    var pre = $(this);
      $.ajax({
        url : $(this).attr('data-src'),
        dataType: "text",
        success : function (data) {
          pre.html('<code class="javascript hljs">' + data + '</code>');
          hljs.highlightBlock(pre.find('code').get(0));
        }
      });
   });
}); 