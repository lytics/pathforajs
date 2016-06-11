Message type modules are focused on deliverying outbound communication for example: announcing a product launch, new content, top-level alert, etc. These modules provide a as simple text message which can be used in a variety of formats.

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

### Modal - [Live Preview](../examples/preview/types/message/modal.html)

![Modal Message Module](../examples/img/types/message/modal.png)

<pre data-src="../../examples/src/types/message/modal.js"></pre>


### Slideout - [Live Preview](../examples/preview/types/message/slideout.html)

![Slideout Message Module](../examples/img/types/message/slideout.png)

<pre data-src="../../examples/src/types/message/slideout.js"></pre>


### Bar - [Live Preview](../examples/preview/types/message/bar.html)

![Bar Message Module](../examples/img/types/message/bar.png)

<pre data-src="../../examples/src/types/message/bar.js"></pre>


### Button - [Live Preview](../examples/preview/types/message/button.html)

![Button Message Module](../examples/img/types/message/button.png)

<pre data-src="../../examples/src/types/message/button.js"></pre>
