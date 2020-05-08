Pathfora gains power by seamlessly integrating with [Lytics](http://www.getlytics.com/) for real-time user identification. This allows for precise audience targeting with each module. Setting this up in Pathfora requires an object with certain targeting rules as the first parameter to [initializeWidgets](/api/methods#initializewidgets).

``` javascript
var modules = {
  target: [{
    segment: 'smt_name',
    widgets: [module]
  }]
};

pathfora.initializeWidgets(modules);
```

For audience targeting, it is required that you load the [Lytics Javascript Tag](https://learn.lytics.com/understanding/product-docs/lytics-javascript-tag/configuration). Pathfora interacts with this tag to retrieve the a list of Lytics audiences that the user is a member of. If you do not load this tag for targeted modules they will never initialize. 

## Setup Your Audiences

You will need to have at least one audience built in Lytics that you want to target with a module. Make sure that you have API access enabled for the audience, and have entered an ID. You will use this id in the targeting rules.
<img class="full" src="../assets/api_access.jpg" alt="Lytics Audience API Acess">

## target

A list of rules assigning modules to audiences.

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>
  
  <tr>
    <td>target</td>
    <td>string</td>
    <td>list of targeting rule objects</td>
  </tr>
  <tr>
</table>

<table>
  <thead>
    <tr>
      <td colspan="3" align="center">object in <code>target</code> array</td>
    </tr>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>segment</td>
    <td>string</td>
    <td>API access ID of the Lytics audience</td>
  </tr>
  <tr>
    <td>widgets</td>
    <td>array</td>
    <td>list of modulels to show the users in the audience</td>
  </tr>
</table>


### Single Target Audience - High Value Users

``` javascript
// example: show a bar module to all users in the `high_value_users` audience promoting new products

var module = new pathfora.Message({
  id: 'targeted_bar',
  layout: 'bar',
  msg: 'Thanks for being a valued customer, please check out our new products.',
  cancelShow: false,
  okMessage: 'View Now',
  confirmAction: {
    name: 'targeted_bar_confirm',
    callback: function () {
      window.location.pathname = '/new-products';
    }
  }
});

var modules = {
  target: [{
    segment: 'high_value_users', // API Access ID for your Lytics audience
    widgets: [module]
  }]
};

pathfora.initializeWidgets(modules);
```


### Multiple Target Audiences - New vs. Returning

``` javascript
// example: change messaging of module for new vs returning users

var newModule = new pathfora.Message({
  id: 'new_slideout',
  layout: 'slideout',
  position: 'bottom-right',
  headline: 'Welcome',
  msg: 'You must be new here! Please take a look at our guide for new users.',
  cancelShow: false,
  okMessage: 'View Guide'
});

var returningModule = new pathfora.Message({
  id: 'returning_slideout',
  layout: 'slideout',
  position: 'bottom-right',
  headline: 'Welcome Back',
  msg: 'Thanks for coming back, why not check out our blog for the newest updates?',
  cancelShow: false,
  okMessage: 'View Blog'
});

var modules = {
  target: [{
    segment: 'new_users', // API Access ID for your Lytics audience
    widgets: [newModule]
  },
  {
    segment: 'returning', // API Access ID for your Lytics audience
    widgets: [returningModule]
  }]
};

pathfora.initializeWidgets(modules);

```

## inverse

Target all users who are not a part of any of the audiences in the defined targeting rules.


<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>
  
  <tr>
    <td>inverse</td>
    <td>array</td>
    <td>list of modules to show any user who is not a member of any of the audiences in the targeting rules</td>
  </tr>
  <tr>
</table>

``` javascript
// example: show a feedback form module to all users that are known (has email)
// and a subsciption module to everyone else

var subscriptionModule = new pathfora.Subscription({
  id: 'sign_up_module',
  layout: 'modal',
  headline: 'Sign Up',
  msg: 'We want to send you updates, sign up now!'
});

var feedbackModule = new pathfora.Message({
  id: 'known_module',
  layout: 'modal',
  headline: 'Give us Feedback',
  msg: 'What do you think of our newest updates?',
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
    widgets: [feedbackModule]
  }],
  inverse: [subscriptionModule]
};

pathfora.initializeWidgets(modules);
```
