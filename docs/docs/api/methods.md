This document will walk you through the methods of the `pathfora` class that will be used to help you deploy your modules. The rest of the SDK documentation will walk you through how to customize your module's configuration, and provide code examples to show you these methods in context.

## initializeWidgets

This method is used to initialize any modules built with Pathfora. It kicks off all the heavy lifting that needs to be done to render the modules on the page based on their configuration settings.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>initializeWidgets</code> function</td>
    </tr>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>modules</td>
    <td>array or targetting object</td>
    <td>list of modules to initilize on the page</td>
  </tr>
  <tr>
    <td>config</td>
    <td>object</td>
    <td><code>optional</code> <a href="../config">generalized configuration</a> settings for multiple modules</td>
  </tr>
  <tr>
    <td>options</td>
    <td>object</td>
    <td><code>optional</code> additional options for the initialization (see below)</td>
  </tr>
</table>

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>options</code> object</td>
    </tr>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>priority</td>
    <td>string</td>
    <td>if set to "ordered" will only show the first valid module from the list initialized</td>
  </tr>
</table>

### Type Configuration Methods

Each module type that Pathfora supports has its own configuration method, which accepts a single object as a parameter. This object should include the configuration settings for the module, the following keys are common across all module configuration types.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center">type configuration object</td>
    </tr>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>id</td>
    <td>string</td>
    <td><code>required</code> unique id for the module, no two modules can have the same id</td>
  </tr>
  <tr>
    <td>msg</td>
    <td>string</td>
    <td>text message content, often contained in a paragraph tag in the module</td>
  </tr>
  <tr>
    <td>headline</td>
    <td>string</td>
    <td>header or title text for the module, not supported by some layouts</td>
  </tr>
  <tr>
    <td>footerText</td>
    <td>string</td>
    <td>text footer content, not supported by some layouts</td>
  </tr>
</table>

We cover each of these type configuration methods and their parameters in individual type sections below.

- [Message](../../types/message)
- [Form](../../types/form)
- [Subscription](../../types/subscription)
- [Gate](../../types/gate)

## initializeABTesting

This method is used to initialize [A/B Tests](/ab_testing) modules. If you're creating an A/B test scenario this should always be called **before** the `initializeWidgets` method.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>initializeABTesting</code> function</td>
    </tr>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>abTests</td>
    <td>array</td>
    <td>list of A/B test config objects to initialize</td>
  </tr>
</table>

### A/B Test Configuration Method

A/B Tests have their own configuration method `ABTest`. We cover this configuration in detail in the [A/B Testing](/ab_testing) section of this documentation.

## recommendContent

recommendContent is a public method that makes a request to the Lytics content recommendation API and returns a list of recommended documents for the user. These results are also placed in session storage to reduce the number of calls to the API on subsequent page loads.

**Note:** Lytics' public recommendation API is only authorized for use on domains that have been whitelisted for your account. Contact your customer success representative `success@lytics.io` if you need to whitelist a new domain.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>initializeWidgets</code> function</td>
    </tr>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>accountId</td>
    <td>string</td>
    <td>id of the Lytics account to make API requests to</td>
  </tr>
  <tr>
    <td>params</td>
    <td>object</td>
    <td>object containing query params to call the <a href="https://docs.lytics.com/reference/public-content-recommendation">recommendation API</a> with</td>
  </tr>
  <tr>
    <td>id</td>
    <td>string</td>
    <td>"unique identifier" for the recommendation, used to reaccess response data from session storage</td>
  </tr>
  <tr>
    <td>callback</td>
    <td>function</td>
    <td>function to execute once we've received a response from the API. This function is passed the document objects in an array</td>
  </tr>
</table>

## triggerWidgets

triggerWidgets is a helper method for widgets with the [manualTrigger](../../display_conditions#manualtrigger) displayCondition. Widgets with this condition will not display until all other display conditions are met, and `pathfora.triggerWidgets` has been called. This method is similar to `initializeWidgets`, in that it is useful when you want to trigger a module on a custom event with JavaScript. However with `triggerWidgets` you don't need to pass in widget object thus you can call this method even before the config has been defined.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>initializeWidgets</code> function</td>
    </tr>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>widgetIds</td>
    <td>array</td>
    <td><code>optional</code> list of ids of widgets to display, if empty this method will trigger all widgets with the <a href="../../display_conditions#manualtrigger">manualTrigger</a> displayCondition</td>
  </tr>
</table>
