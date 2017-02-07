A slideout is a medium module which slides from either side into the window. This module provides a good amount of space for text and content without taking the full attention of the user.

## position

Positition of the slideout module relative to the browser window.

<table>
  <thead>
    <tr>
      <td colspan="2" align="center"><code>position</code> string</td>
    </tr>
    <tr>
      <th>Value</th>
      <th>Behavior</th>
    </tr>
  </thead>
  
  <tr>
    <td>bottom-left</td>
    <td><code>default</code> display the module in the bottom left corner of the window</td>
  </tr>
  <tr>
    <td>bottom-right</td>
    <td>display the module in the bottom right corner of the window</td>
  </tr>
  <tr>
    <td>left</td>
    <td>display the module in the center left of the window</td>
  </tr>
  <tr>
    <td>right</td>
    <td>display the module in the center right of the window</td>
  </tr>
  <tr>
    <td>top-left</td>
    <td>display the module in the top left corner of the window</td>
  </tr>
  <tr>
    <td>top-right</td>
    <td>display the module in the top right corner of the window</td>
  </tr>
</table>


<h3>Positions - <a href="../../examples/preview/layouts/slideout/positions.html" target="_blank">Live Preview</a></h3>

![Position Slideout Modules](../examples/img/layouts/slideout/positions.png)

<pre data-src="../../examples/src/layouts/slideout/positions.js"></pre>


## origin

Origin is the direction from which the the module will slide in.

<table>
  <thead>
    <tr>
      <td colspan="2" align="center"><code>origin</code> string</td>
    </tr>
    <tr>
      <th>Value</th>
      <th>Behavior</th>
    </tr>
  </thead>
  
  <tr>
    <td>left</td>
    <td><code>default</code> for bottom-left positioned modules</td>
  </tr>
  <tr>
    <td>right</td>
    <td><code>default</code> for bottom-right positioned modules</td>
  </tr>
  <tr>
    <td>bottom</td>
    <td>module slides up from the bottom of the window</td>
  </tr>
</table>


<h3>Bottom - <a href="../../examples/preview/layouts/slideout/origin.html" target="_blank">Live Preview</a></h3>

<pre data-src="../../examples/src/layouts/slideout/origin.js"></pre>


## variant

Variant determines any extra content that may be used by the module.

<table>
  <thead>
    <tr>
      <td colspan="2" align="center"><code>variant</code> int</td>
    </tr>
    <tr>
      <th>Value</th>
      <th>Behavior</th>
    </tr>
  </thead>
  
  <tr>
    <td>1</td>
    <td><code>default</code> text-only-module</td>
  </tr>
  <tr>
    <td>2</td>
    <td>module includes an image</td>
  </tr>
  <tr>
    <td>3</td>
    <td>module includes a <a href="../../content_recommend">content recommendation</a> (this feature is in <b>beta</b>)</td>
  </tr>
</table>

## image

Define the featured image you would like to use for the module.

**Note:** This setting is only valid for modules with a variant value of 2.

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>
  
  <tr>
    <td>image</td>
    <td>string</td>
    <td>URL of the image to feature</td>
  </tr>
</table>

<h3>Image (variant 2) - <a href="../../examples/preview/layouts/slideout/image.html" target="_blank">Live Preview</a></h3>

![Image Slideout Module](../examples/img/layouts/slideout/image.png)

<pre data-src="../../examples/src/layouts/slideout/image.js"></pre>
