Part of what makes Pathfora powerful is its ability to interact with [Lytics](http://www.getlytics.com/) and target certain audiences with certain modules. Setting up the targeting in Pathfora requires an object with certain targeting rules as the first param to `initializeWidgets` instead of an array of widgets. And it must include a second, `string` param, your Lytics account ID.

``` javascript
var modules = {
  target: [{
    segment: 'smt_name',
    widgets: [ module ]
  }]
};

pathfora.initializeWidgets(modules, "YOUR LYTICS ACCOUNT ID");
```

## Setup

To target an audience with a module you will need to know your Lytics Account ID. Your account ID should be the same as the one in the Lytics javascript tag.

<img class="full" src="../../assets/acctid.jpg" alt="Lytics Jstag Account Id">

You will also need to make sure that any domain you want to use Pathfora on is whitelisted in your account, you can contact your customer success representative `success@getlytics.com` to do this. Your account should already have any domain whitelisted with the Lytics javascript tag installed on it, but be sure to include your local and testing environments. 

Finally you'll need to have at least one audience built in Lytics that you want to target with a module. Make sure that you have API access enabled for the audience, and have entered an ID.

<img class="full" src="../../assets/api_access.jpg" alt="Lytics Jstag Account Id">

## target

A list of rules assigning modules to audiences.

<table>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td>target</td>
    <td>array</td>
    <td>list of objects containing targeting rules</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3" align="center">object in <code>target</code> array</td>
  </tr>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td>segment</td>
    <td>string</td>
    <td>API access ID of the Lytics audience</td>
  </tr>
  <tr>
    <td>widgets</td>
    <td>array</td>
    <td>list of modules to show to users in the audience</td>
  </tr>
</table>


### Single Target Audience - High Value Users

``` javascript
// example: show a bar module to all users in the `high_value_users` audience promoting new products

var module = pathfora.Message({
  id: 'targeted_bar',
  layout: 'bar',
  msg: 'Thanks for being a valued customer, please check out our new products.'
  cancelShow: false,
  okMessage: 'View Now',
  confirmAction: {
    name: "targeted_bar_confirm",
    callback: function () {
      window.location.pathname = "/new-products";
    }
  }
});

var modules = {
  target: [{
    segment: 'high_value_users', // API Access ID for your Lytics audience
    widgets: [ module ]
  }]
};

var lyticsAcctId = "YOUR LYTICS ACCOUNT ID";

pathfora.initializeWidgets(modules, lyticsAcctId);
```


### Multiple Target Audiences - New vs. Returning

``` javascript
// example: change messaging of module for new vs returning users

var newModule = pathfora.Message({
  id: 'new_slideout',
  layout: 'slideout',
  position: 'bottom-right',
  headline: 'Welcome'
  msg: 'You must be new here! Please take a look at our guide for new users.'
  cancelShow: false,
  okMessage: 'View Guide',
});

var returningModule = pathfora.Message({
  id: 'returning_slideout',
  layout: 'slideout',
  position: 'bottom-right',
  headline: 'Welcome Back'
  msg: 'Thanks for coming back, why not check out our blog for the newest updates?'
  cancelShow: false,
  okMessage: 'View Blog',
});

var modules = {
  target: [{
    segment: 'new_users', // API Access ID for your Lytics audience
    widgets: [ newModule ]
  },
  {
    segment: 'returning', // API Access ID for your Lytics audience
    widgets: [ returningModule ]
  }]
};

var lyticsAcctId = "YOUR LYTICS ACCOUNT ID";

pathfora.initializeWidgets(modules, lyticsAcctId);
```

## inverse

Target all users who are not a part of any of the audiences in the defined targeting rules.

<table>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td>target</td>
    <td>array</td>
    <td>list of modules to show any user who is not a member of any of the audiences in the targeting rules</td>
  </tr>
</table>

``` javascript
// example: show a feedback form module to all users that are known (has email)
// and a subsciption module to everyone else

var subscriptionModule = pathfora.Subscription({
  id: 'sign_up_module',
  layout: 'modal',
  headline: 'Sign Up'
  msg: 'We want to send you updates, sign up now!'
});

var feedbackModule = pathfora.Message({
  id: 'known_module',
  layout: 'modal',
  headline: 'Give us Feedback'
  msg: 'What do you think of our newest updates?'
  fields: {
    name: false,
    email: false,
    title: false,
    message: true
  }
});

var modules = {
  target: [{
    segment: 'known', // API Access ID for your Lytics audience
    widgets: [ feedbackModule ]
  }],
  inverse: [ subscriptionModule ]
};

var lyticsAcctId = "YOUR LYTICS ACCOUNT ID";

pathfora.initializeWidgets(modules, lyticsAcctId);
```
