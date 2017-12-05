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
    <td>close</td>
    <td>boolean</td>
    <td><code>optional</code> if false, prevent the modal from closing after the callback is executed</td>
  </tr>
  <tr>
    <td>callback</td>
    <td>function</td>
    <td><code>optional</code> function to execute when the use clicks the "confirm" button (see params below)</td>
  </tr>
  <tr>
    <td>waitForAsyncResponse</td>
    <td>boolean</td>
    <td><code>optional</code> if true, a third parameter (cb) will be passed to the callback function (see params below)</td>
  </tr>
</table>

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>callback</code>function</td>
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
    <td>name of the event</td>
  </tr>
  <tr>
    <td>payload</td>
    <td>object</td>
    <td>object containing the rendered DOM Element (widget), the config of the widget (config), the javascript event (event), and the data submitted by the user in the case of modules with a form (data)</td>
  </tr>
  <tr>
    <td>cb</td>
    <td>function</td>
    <td><code>optional</code> cb accepts a single boolean param, if true, the submission was counted as successful, and the <a href="../customization/form/#formstates">success state</a> will show. if false, the <a href="../customization/form/#formstates">error state</a> will show.</td>
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
    <td>close</td>
    <td>boolean</td>
    <td><code>optional</code> if false, prevent the modal from closing after the callback is executed</td>
  </tr>
  <tr>
    <td>callback</td>
    <td>function</td>
    <td><code>optional</code> function to execute when the use clicks the "cancel" button (see params below)</td>
  </tr>
</table>

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>callback</code>function</td>
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
    <td>name of the event</td>
  </tr>
  <tr>
    <td>payload</td>
    <td>object</td>
    <td>object containing the rendered DOM Element (widget), the config of the widget (config), and the javascript event (event)</td>
  </tr>
</table>


<h3><a href="../examples/preview/callbacks/cancelAction.html" target="_blank">Live Preview</a></h3>

<pre data-src="../examples/src/callbacks/cancelAction.js"></pre>

## closeAction
Set a [tracking name](/tracking.md) and javascript callback for a "close" button click event.

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
    <td><code>optional</code> function to execute when the use clicks the "close" button (see params below)</td>
  </tr>
</table>

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>callback</code>function</td>
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
    <td>name of the event</td>
  </tr>
  <tr>
    <td>payload</td>
    <td>object</td>
    <td>object containing the rendered DOM Element (widget), the config of the widget (config), and the javascript event (event)</td>
  </tr>
</table>


<h3><a href="../examples/preview/callbacks/closeAction.html" target="_blank">Live Preview</a></h3>

<pre data-src="../examples/src/callbacks/closeAction.js"></pre>



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
    <td>name of the event</td>
  </tr>
  <tr>
    <td>payload</td>
    <td>object</td>
    <td>object containing the pathfora module (config)</td>
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
    <td>name of the event</td>
  </tr>
  <tr>
    <td>payload</td>
    <td>object</td>
    <td>object containing the Pathfora module (config) and the rendered DOM Element (widget)</td>
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
    <td>name of the event</td>
  </tr>
  <tr>
    <td>payload</td>
    <td>object</td>
    <td>object containing the rendered DOM Element (widget), the pathfora module (config), and the javascript MouseEvent (event)</td>
  </tr>
</table>


<h3><a href="../examples/preview/callbacks/onClick.html" target="_blank">Live Preview</a></h3>

<pre data-src="../examples/src/callbacks/onClick.js"></pre>

## onSubmit (deprecated)

**This callback is deprecated. We advise using [confirmAction](#confirmaction) instead, as it has the same functionality.**

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
    <td>name of the event</td>
  </tr>
  <tr>
    <td>payload</td>
    <td>object</td>
    <td>object containing the rendered DOM Element (widget), the pathfora module (config), and the javascript Event (event), and the data submitted by the user (data)</td>
  </tr>
</table>

<h3><a href="../examples/preview/callbacks/onSubmit.html" target="_blank">Live Preview</a></h3>

<pre data-src="../examples/src/callbacks/onSubmit.js"></pre>

## onModalClose
Javascript callback function for when a module is closed, this will fire anytime the modal is closed, regardless if the user clicks the confirm, close, or cancel button.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>onModalClose</code>function</td>
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
    <td>name of the event</td>
  </tr>
  <tr>
    <td>payload</td>
    <td>object</td>
    <td>object containing the rendered DOM Element (widget), the pathfora module (config), and the javascript Event (event), and the data submitted by the user (data)</td>
  </tr>
</table>

<h3><a href="../examples/preview/callbacks/onModalClose.html" target="_blank">Live Preview</a></h3>

<pre data-src="../examples/src/callbacks/onModalClose.js"></pre>