For multiple modules with common elements we can define a configuration to apply to all modules, or all modules of a certain type. Maintaining a config helps reduce the code repitition and allows you to change settings accross many widgets in one place. A config object can be passed as third, optional argument to `initializeWidgets`.

``` javascript
var config = {
  // config settings
};

// Lytics Account ID can be an empty string if not used for targeting
pathfora.initializeWidgets([ module, module2 ], "", config);
```

<table>
  <tr>
    <td colspan="3" align="center"><code>config</code> object</td>
  </tr>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td>generic</td>
    <td>obj</td>
    <td><code>optional</code> setting which should apply to all modules initialized with this config</td>
  </tr>
  <tr>
    <td>message</td>
    <td>obj</td>
    <td><code>optional</code> setting which should apply to all <b>message</b> modules initialized with this config</td>
  </tr>
   <tr>
    <td>form</td>
    <td>obj</td>
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

### [Live Preview](../../examples/preview/config/config.html)

![General Config](../examples/img/config/config.png)

<pre data-src="../../examples/src/config/config.js"></pre>