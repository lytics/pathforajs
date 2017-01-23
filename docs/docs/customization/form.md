Pathfora allows for some customization on form elements including hiding specific input fields, setting placeholder text, and selecting which fields are required for the user to submit the form.

## fields

Select which fields should be a part of the module's form. By default, a [form](/types/form.md) module has the name, email, title, and message fields. And a [gate](/types/form.md) module has the name, email, company, and title fields. 

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>fields</code> object</td>
    </tr>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>name</td>
    <td>boolean</td>
    <td><code>optional</code> show or hide input for the user's full name</td>
  </tr>
  <tr>
    <td>email</td>
    <td>boolean</td>
    <td><code>optional</code> show or hide input for the user's email address</td>
  </tr>
  <tr>
    <td>title</td>
    <td>boolean</td>
    <td><code>optional</code> show or hide input for the user's job title</td>
  </tr>
  <tr>
    <td>company</td>
    <td>boolean</td>
    <td><code>optional</code> show or hide input for the user's company of employment</td>
  </tr>
  <tr>
    <td>phone</td>
    <td>boolean</td>
    <td><code>optional</code> show or hide input for the user's phone number</td>
  </tr>
  <tr>
    <td>referralEmail</td>
    <td>boolean</td>
    <td><code>optional</code> show or hide input for a referral email</td>
  </tr>
  <tr>
    <td>message</td>
    <td>boolean</td>
    <td><code>optional</code> show or hide texarea field for comments or a longer form message</td>
  </tr>
</table>

<h3>Show/Hide Fields - <a href="../../examples/preview/customization/form/fields.html" target="_blank">Live Preview</a></h3>

![Form Fields](../examples/img/customization/form/fields.png)

<pre data-src="../../examples/src/customization/form/fields.js"></pre>

## required

Set which fields are required to be filled out by the user to submit the form. By default only name and email fields are required for all modules with forms.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>required</code> object</td>
    </tr>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>name</td>
    <td>boolean</td>
    <td><code>optional</code> set the required status for the name field</td>
  </tr>
  <tr>
    <td>email</td>
    <td>boolean</td>
    <td><code>optional</code> set the required status for the email address field</td>
  </tr>
  <tr>
    <td>title</td>
    <td>boolean</td>
    <td><code>optional</code> set the required status for the job title field</td>
  </tr>
  <tr>
    <td>company</td>
    <td>boolean</td>
    <td><code>optional</code> set the required status for the company of employment field</td>
  </tr>
  <tr>
    <td>phone</td>
    <td>boolean</td>
    <td><code>optional</code> set the required status for the phone number field</td>
  </tr>
  <tr>
    <td>referralEmail</td>
    <td>boolean</td>
    <td><code>optional</code> set the required status for the referral email field</td>
  </tr>
  <tr>
    <td>message</td>
    <td>boolean</td>
    <td><code>optional</code> set the required status for the long form message field</td>
  </tr>
</table>


<h3>Required Fields - <a href="../../examples/preview/customization/form/required.html" target="_blank">Live Preview</a></h3>

![Required Form Fields](../examples/img/customization/form/required.png)

<pre data-src="../../examples/src/customization/form/required.js"></pre>


## placeholders

Set the placeholder text for form elements.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>placeholders</code> object</td>
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
    <td><code>optional</code> set the placeholder text for the name field</td>
  </tr>
  <tr>
    <td>email</td>
    <td>string</td>
    <td><code>optional</code> set the placeholder text for the email address field</td>
  </tr>
  <tr>
    <td>title</td>
    <td>string</td>
    <td><code>optional</code> set the placeholder text for the job title field</td>
  </tr>
  <tr>
    <td>company</td>
    <td>string</td>
    <td><code>optional</code> set the placeholder text for the company of employment field</td>
  </tr>
  <tr>
    <td>phone</td>
    <td>string</td>
    <td><code>optional</code> set the placeholder text for the phone number field</td>
  </tr>
  <tr>
    <td>referralEmail</td>
    <td>string</td>
    <td><code>optional</code> set the placeholder text for the referral email field</td>
  </tr>
  <tr>
    <td>message</td>
    <td>string</td>
    <td><code>optional</code> set the placeholder text for the long form message field</td>
  </tr>
</table>

<h3>Placeholders - <a href="../../examples/preview/customization/form/placeholders.html" target="_blank">Live Preview</a></h3>

![Form Field Placeholders](../examples/img/customization/form/placeholders.png)

<pre data-src="../../examples/src/customization/form/placeholders.js"></pre>


## success

Set a custom success/confirmation message to show after the user submits a form before hiding the module.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>success</code> object</td>
    </tr>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>headline</td>
    <td>string</td>
    <td>header or title text for the success state</td>
  </tr>
  <tr>
    <td>msg</td>
    <td>string</td>
    <td>text message content of the success state</td>
  </tr>
  <tr>
    <td>delay</td>
    <td>int</td>
    <td>how long in seconds to show the success state before hiding the module. if 0, the module will not hide until the user closes it.</td>
  </tr>
</table>

<h3>Success State - <a href="../../examples/preview/customization/form/success.html" target="_blank">Live Preview</a></h3>

![Form Field Placeholders](../examples/img/customization/form/success.png)

<pre data-src="../../examples/src/customization/form/success.js"></pre>

