All actions taken for clicking a button, submitting a form, and other such events support optional javascript callback settings.

## confirmAction
Set a [tracking name](/tracking.md) and javascript callback for a "confirm" button click event.

<table>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td>confirmAction</td>
    <td>obj</td>
    <td>must be object formatted using following options / values</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3" align="center"><code>confirmAction</code> object</td>
  </tr>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td> name </td>
    <td>string</td>
    <td><code>optional</code> name of the confirm event to send to Lytics and Google Analytics</td>
  </tr>
  <tr>
    <td> callback </td>
    <td>function</td>
    <td><code>optional</code> function to execute when the use clicks the "confirm" button</td>
  </tr>
</table>

### [Live Preview](../../examples/preview/callbacks/confirmAction.html)

<pre data-src="../../examples/src/callbacks/confirmAction.js"></pre>

## cancelAction
Set a [tracking name](/tracking.md) and javascript callback for a "cancel" button click event.

<table>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td>cancelAction</td>
    <td>obj</td>
    <td>must be object formatted using following options / values</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3" align="center"><code>cancelAction</code> object</td>
  </tr>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td> name </td>
    <td>string</td>
    <td><code>optional</code> name of the cancel event to send to Lytics and Google Analytics</td>
  </tr>
  <tr>
    <td> callback </td>
    <td>function</td>
    <td><code>optional</code> function to execute when the use clicks the "cancel" button</td>
  </tr>
</table>

### [Live Preview](../../examples/preview/callbacks/cancelAction.html)

<pre data-src="../../examples/src/callbacks/cancelAction.js"></pre>

## onInit
Javascript callback function on initialization of the module, this should trigger just before the module is shown.

<table>
  <tr>
    <td colspan="3" align="center"><code>onInit</code> params</td>
  </tr>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td> event </td>
    <td>string</td>
    <td>name of the event</td>
  </tr>
  <tr>
    <td> payload </td>
    <td>object</td>
    <td>pathfora module object</td>
  </tr>
</table>

### [Live Preview](../../examples/preview/callbacks/onInit.html)

<pre data-src="../../examples/src/callbacks/onInit.js"></pre>


## onLoad
Javascript callback function on loading the module, triggered when the module is shown to the user.

<table>
  <tr>
    <td colspan="3" align="center"><code>onLoad</code> params</td>
  </tr>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td> event </td>
    <td>string</td>
    <td>name of the event</td>
  </tr>
  <tr>
    <td> payload </td>
    <td>object</td>
    <td>pathfora module object and the rendered DOM Element</td>
  </tr>
</table>


### [Live Preview](../../examples/preview/callbacks/onLoad.html)

<pre data-src="../../examples/src/callbacks/onLoad.js"></pre>


## onClick
Javascript callback function **for [button layouts](/layouts/button.md) only** on click of the button widget.

<table>
  <tr>
    <td colspan="3" align="center"><code>onClick</code> params</td>
  </tr>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td> event </td>
    <td>string</td>
    <td>name of the event</td>
  </tr>
  <tr>
    <td> payload </td>
    <td>object</td>
    <td>click event</td>
  </tr>
</table>

### [Live Preview](../../examples/preview/callbacks/onClick.html)

<pre data-src="../../examples/src/callbacks/onClick.js"></pre>

## onSubmit
Javascript callback function **for any types with form elements** on submission of the form (includes form data as param).

<table>
  <tr>
    <td colspan="3" align="center"><code>onSubmit</code> params</td>
  </tr>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td> event </td>
    <td>string</td>
    <td>name of the event</td>
  </tr>
  <tr>
    <td> payload </td>
    <td>object</td>
    <td>submit event payload including form data</td>
  </tr>
</table>

### [Live Preview](../../examples/preview/callbacks/onSubmit.html)

<pre data-src="../../examples/src/callbacks/onSubmit.js"></pre>