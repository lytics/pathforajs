For multiple modules with common elements we can define a configuration to apply to all modules, or all modules of a certain type. Maintaining a common config helps reduce the code repitition and allows you to change settings accross many widgets in one place. A config object can be passed as a second, optional argument to [initializeWidgets](/api/methods.md#initializewidgets).

``` javascript
var config = {
  generic: {
    theme: 'dark'
  }
};

pathfora.initializeWidgets([module, module2], config);
```

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>config</code> object</td>
    </tr>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>
  <tr>
    <td>generic</td>
    <td>object</td>
    <td><code>optional</code> setting which should apply to all modules initialized with this config</td>
  </tr>
  <tr>
    <td>message</td>
    <td>object</td>
    <td><code>optional</code> setting which should apply to all <b>message</b> modules initialized with this config</td>
  </tr>
   <tr>
    <td>form</td>
    <td>object</td>
    <td><code>optional</code> setting which should apply to all <b>form</b> modules initialized with this config</td>
  </tr>
  <tr>
    <td>subscription</td>
    <td>object</td>
    <td><code>optional</code> setting which should apply to all <b>subscription</b> modules initialized with this config</td>
  </tr>
   <tr>
    <td>sitegate</td>
    <td>object</td>
    <td><code>optional</code> setting which should apply to all <b>gate</b> modules initialized with this config</td>
  </tr>
 </table>

## Example

<h3><a href="../../examples/preview/config/config.html" target="_blank">Live Preview</a></h3>

![General Config](../examples/img/config/config.png)

<pre data-src="../../examples/src/config/config.js"></pre>
