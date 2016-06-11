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
    <td>acctid</td>
    <td>string</td>
    <td><code>optional</code> your <a href="../acctid">Lytics account ID</a> (required for some features)</td>
  </tr>
  <tr>
    <td>config</td>
    <td>object</td>
    <td><code>optional</code> <a href="../config">generalized configuration</a> settings for multiple modules</td>
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
</table>




We cover each of these type configuration methods and their parameters in individual type sections below.

- [Message](/types/message.md)
- [Form](/types/form.md)
- [Subscription](/types/subscription.md)
- [Gate](/types/gate.md)


## initializeABTesting

This method is used to initialize [A/B Tests](/ab_testing.md) modules. If you're creating an A/B test scenario this  should always be called **before** the `initializeWidgets` method.

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

A/B Tests have their own configuration method `ABTest`. We cover this configuration in detail in the [A/B Testing](/ab_testing.md) section of this documentation.


## integrateWithFacebook

Pathfora can integrate with your Facebook App to allow users to autofill the fields of [form](/types/form.md) or [gate](/types/gate.md) modules with their facebook profile information. This method is used to authenticate this integration with Facebook. This method should be called **before** the `initializeWidgets` method.

**Note:** In addition to using this method, you will need to enable [social login](/types/form.md#showsociallogin) in your module's config to allow for form autofill.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>integrateWithFacebook</code> function</td>
    </tr>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>appId</td>
    <td>string</td>
    <td><a href="https://developers.facebook.com/docs/apps/register#app-id">app id</a> for your Facebook application</td>
  </tr>
</table>

## integrateWithGoogle

Pathfora can integrate with your Google App to allow users to autofill the fields of [form](/types/form.md) or [gate](/types/gate.md) modules with their Google account information. This method is used to authenticate this integration with Google. This method should be called **before** the `initializeWidgets` method.

**Note:** In addition to using this method, you will need to enable [social login](/types/form.md#showsociallogin) in your module's config to allow for form autofill.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>integrateWithGoogle</code> function</td>
    </tr>
    <tr>
      <th>Parameter</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>clientID</td>
    <td>string</td>
    <td><a href="https://developers.google.com/identity/sign-in/web/devconsole-project">client id</a> from your Google Developers Console project</td>
  </tr>
</table>
