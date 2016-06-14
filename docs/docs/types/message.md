Message type modules are focused on delivering outbound communication for example: announcing a product launch, new content, top-level alert, etc. These modules provide a simple text message which can be used in a variety of formats.

``` javascript
var module = pathfora.Message({
  id: 'my-message-module-id',
  headline: 'My Headline Text',
  msg: 'My message text here.'
});

pathfora.initializeWidgets([ module ]);
```

## layout

Define which layout type the form module should use.

<table>
  <thead>
    <tr>
      <td colspan="2" align="center"><code>layout</code> string</td>
    </tr>
    <tr>
      <th>Value</th>
      <th>Behavior</th>
    </tr>
  </thead>
  
  <tr>
    <td>modal</td>
    <td>module uses a <a href="../../layouts/modal">modal layout</a></td>
  </tr>
  <tr>
    <td>slideout</td>
    <td>module uses a <a href="../../layouts/slideout">slideout layout</a></td>
  </tr>
  <tr>
    <td>bar</td>
    <td>module uses a <a href="../../layouts/bar">bar layout</a></td>
  </tr>
  <tr>
    <td>button</td>
    <td>module uses a <a href="../../layouts/button">button layout</a></td>
  </tr>
</table>

<h3>Modal - <a href="../../examples/preview/types/message/modal.html" target="_blank">Live Preview</a></h3>

![Modal Message Module](../examples/img/types/message/modal.png)

<pre data-src="../../examples/src/types/message/modal.js"></pre>


<h3>Slideout - <a href="../../examples/preview/types/message/slideout.html" target="_blank">Live Preview</a></h3>

![Slideout Message Module](../examples/img/types/message/slideout.png)

<pre data-src="../../examples/src/types/message/slideout.js"></pre>


<h3>Bar - <a href="../../examples/preview/types/message/bar.html" target="_blank">Live Preview</a></h3>

![Bar Message Module](../examples/img/types/message/bar.png)

<pre data-src="../../examples/src/types/message/bar.js"></pre>


<h3>Button - <a href="../../examples/preview/types/message/button.html" target="_blank">Live Preview</a></h3>

![Button Message Module](../examples/img/types/message/button.png)

<pre data-src="../../examples/src/types/message/button.js"></pre>
