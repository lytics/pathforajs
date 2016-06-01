Pathfora has two basic pre-built color themes, light (default if no theme is set) and dark. Furthermore, the user can set their own custom colors for any element of the module within the javascript configuration. For more advanced color and style customization you can [add your own CSS](/customization/css.md).

## theme
Set the color scheme of the module, this can be a predefined theme or indicate that the module should have custom colors.

| Value | Type | Behavior |
|---|---|---|
| light | string | `default` default light color scheme |
| dark | string | a predefined darker color scheme |  
| custom | string | the user should define custom colors using `colors` |  

### Dark Theme - [Live Preview](../../examples/preview/customization/themes/dark.html)

![Form Placeholders](../examples/img/customization/themes/dark.png)

<pre data-src="../../examples/src/customization/themes/dark.js"></pre>


## colors
Define a set of custom colors for each element of the module.

<table>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td>colors</td>
    <td>obj</td>
    <td>must be object formatted using following options / values</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3" align="center"><code>fields</code> object</td>
  </tr>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td> background </td>
    <td>string</td>
    <td><code>optional</code> hex color code for the background of the module</td>
  </tr>
  <tr>
    <td> text </td>
    <td>string</td>
    <td><code>optional</code> hex color code for the msg text</td>
  </tr>
  <tr>
    <td> headline </td>
    <td>boolean</td>
    <td><code>optional</code> hex color code for the headline text/td>
  </tr>
  <tr>
    <td> close </td>
    <td>boolean</td>
    <td><code>optional</code> hex color code for close button ("X" in the corner)</td>
  </tr>
  <tr>
    <td> actionBackground </td>
    <td>boolean</td>
    <td><code>optional</code> hex color code for the background of the "confirm" button</td>
  </tr>
  <tr>
    <td> actionText </td>
    <td>boolean</td>
    <td><code>optional</code> hex color code for the text of the "confirm" button</td>
  </tr>
  <tr>
    <td> cancelBackground </td>
    <td>boolean</td>
    <td><code>optional</code> hex color code for the background of the "cancel" button</td>
  </tr>
  <tr>
    <td> cancelText </td>
    <td>boolean</td>
    <td><code>optional</code> hex color code for the text of the "cancel" button</td>
  </tr>
  <tr>
    <td> fieldBackground </td>
    <td>boolean</td>
    <td><code>optional</code> hex color code for the background of field elements</td>
  </tr>
</table>

### Custom Theme - [Live Preview](../../examples/preview/customization/themes/custom.html)

![Form Placeholders](../examples/img/customization/themes/custom.png)

<pre data-src="../../examples/src/customization/themes/custom.js"></pre>