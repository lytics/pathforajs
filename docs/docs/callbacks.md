All actions taken for clicking a button, submitting a form, and other such events support optional javascript callback settings.

## confirmAction
Set a [tracking name](/tracking.md) and javascript callback for a "confirm" button click event.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>confirmAction</code> object</td>
    </tr>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>name</td>
    <td>string</td>
    <td><code>optional</code> name of the confirm event to send to Lytics and Google Analytics</td>
  </tr>
  <tr>
    <td>callback</td>
    <td>function</td>
    <td><code>optional</code> function to execute when the use clicks the "confirm" button</td>
  </tr>
</table>

<h3><a href="../examples/preview/callbacks/confirmAction.html" target="_blank">Live Preview</a></h3>

<pre data-src="../examples/src/callbacks/confirmAction.js"></pre>

## cancelAction
Set a [tracking name](/tracking.md) and javascript callback for a "cancel" button click event.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>cancelAction</code> object</td>
    </tr>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>name</td>
    <td>string</td>
    <td><code>optional</code> name of the cancel event to send to Lytics and Google Analytics</td>
  </tr>
  <tr>
    <td>callback</td>
    <td>function</td>
    <td><code>optional</code> function to execute when the use clicks the "cancel" button</td>
  </tr>
</table>

<h3><a href="../examples/preview/callbacks/cancelAction.html" target="_blank">Live Preview</a></h3>

<pre data-src="../examples/src/callbacks/cancelAction.js"></pre>

## onInit
Javascript callback function on initialization of the module. This should trigger just before the module is shown.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>onInit</code>function</td>
    </tr>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>event</td>
    <td>string</td>
    <td><code>optional</code> name of the event</td>
  </tr>
  <tr>
    <td>module</td>
    <td>object</td>
    <td><code>optional</code> Pathfora module object</td>
  </tr>
</table>

<h3><a href="../examples/preview/callbacks/onInit.html" target="_blank">Live Preview</a></h3>

<pre data-src="../examples/src/callbacks/onInit.js"></pre>


## onLoad
Javascript callback function on loading the module, triggered when the module is shown to the user.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>onLoad</code>function</td>
    </tr>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>event</td>
    <td>string</td>
    <td><code>optional</code> name of the event</td>
  </tr>
  <tr>
    <td>payload</td>
    <td>object</td>
    <td><code>optional</code> object containing the Pathfora module and the rendered DOM Element</td>
  </tr>
</table>


<h3><a href="../examples/preview/callbacks/onLoad.html" target="_blank">Live Preview</a></h3>

<pre data-src="../examples/src/callbacks/onLoad.js"></pre>


## onClick
Javascript callback function **for [button layouts](/layouts/button.md) only** on click of the button widget.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>onClick</code>function</td>
    </tr>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>event</td>
    <td>string</td>
    <td><code>optional</code> name of the event</td>
  </tr>
  <tr>
    <td>payload</td>
    <td>object</td>
    <td><code>optional</code> object containing the rendered DOM Element and the javascript MouseEvent</td>
  </tr>
</table>


<h3><a href="../examples/preview/callbacks/onClick.html" target="_blank">Live Preview</a></h3>

<pre data-src="../examples/src/callbacks/onClick.js"></pre>

## onSubmit
Javascript callback function **for any types with form elements** on submission of the form (includes form data as param).

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>onSubmit</code>function</td>
    </tr>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>event</td>
    <td>string</td>
    <td><code>optional</code> name of the event</td>
  </tr>
  <tr>
    <td>payload</td>
    <td>object</td>
    <td><code>optional</code> object containing the rendered DOM Element, and the javascript Event, and the data submitted by the user</td>
  </tr>
</table>

<h3><a href="../examples/preview/callbacks/onSubmit.html" target="_blank">Live Preview</a></h3>

<pre data-src="../examples/src/callbacks/onSubmit.js"></pre>