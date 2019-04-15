A modal is a large size module with an overlay behind it. It's meant to cover a substantial area of the browser window, so that it demands attention from the user.

## variant

Variant determines any extra content (dictated by extra keys in the config) that may be used by the module.

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
    <td>module includes a <a href="../../content_recommend">content recommendation</a></td>
  </tr>
  <tr>
    <td>4</td>
    <td>module icludes a background image</td>
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

<h3>Image (variant 2) - <a href="../../examples/preview/layouts/modal/image.html" target="_blank">Live Preview</a></h3>

![Image Slideout Module](../examples/img/layouts/modal/image.png)

<pre data-src="../../examples/src/layouts/modal/image.js"></pre>

## background image

Define the background image and position you would like to use for the module.

**Note:** This setting is only valid for modules with a variant value of 4

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>backgroundImage</code> object</td>
    </tr>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>src</td>
    <td>string</td>
    <td>URL of the image</td>
  </tr>

  <tr>
    <td>position</td>
    <td>string</td>
    <td><code>optional</code> position of the image: top, bottom, right, or left</td>
  </tr>
</table>

<h3>Customzing position</h3>
<p>The position of the background image and the text block can be tweaked with <a href="../../customization/css">custom css</a>.</p>

<h3>Background Image (variant 4) - <a href="../../examples/preview/layouts/modal/backgroundImage.html" target="_blank">Live Preview</a></h3>
![Background Image Module](../examples/img/layouts/modal/backgroundImage.png)
<pre data-src="../../examples/src/layouts/modal/backgroundImage.js"></pre>

<h3>Background Image (variant 4) - Position Top - <a href="../../examples/preview/layouts/modal/backgroundImageTop.html" target="_blank">Live Preview</a></h3>
![Background Image Module Position Top](../examples/img/layouts/modal/backgroundImage-top.png)
<pre data-src="../../examples/src/layouts/modal/backgroundImageTop.js"></pre>

<h3>Background Image (variant 4) - Position Bottom - <a href="../../examples/preview/layouts/modal/backgroundImageBottom.html" target="_blank">Live Preview</a></h3>
![Background Image Module Position Bottom](../examples/img/layouts/modal/backgroundImage-bottom.png)
<pre data-src="../../examples/src/layouts/modal/backgroundImageBottom.js"></pre>

<h3>Background Image (variant 4) - Position Right - <a href="../../examples/preview/layouts/modal/backgroundImageRight.html" target="_blank">Live Preview</a></h3>
![Background Image Module Position Bottom](../examples/img/layouts/modal/backgroundImage-right.png)
<pre data-src="../../examples/src/layouts/modal/backgroundImageRight.js"></pre>

<h3>Background Image (variant 4) - Position Left - <a href="../../examples/preview/layouts/modal/backgroundImageLeft.html" target="_blank">Live Preview</a></h3>
![Background Image Module Position Bottom](../examples/img/layouts/modal/backgroundImage-left.png)
<pre data-src="../../examples/src/layouts/modal/backgroundImageLeft.js"></pre>
