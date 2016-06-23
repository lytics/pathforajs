Pathfora supports A/B testing on a global level as well as on a targeted audience. You can split a pool of users to show some proportion of them a group of modules "A" and the other portion a group "B".


``` javascript
var moduleTest = pathfora.ABTest({
  id: 'ab-test-id',
  type: '50/50',
  groups: [
    [ moduleA ],
    [ ]
  ]
});

pathfora.initializeABTesting([ moduleTest ]);
pathfora.initializeWidgets([ moduleA ]);
```

## ABTest

Pathfora has a special configuration method for A/B Testing. This configuration is then used as a parameter for [initializeABTesting](/api/methods/#initializeabtesting).

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>ABTest</code> settings object</td>
    </tr>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>id</td>
    <td>string</td>
    <td>unique identifier for the A/B Test</td>
  </tr>
  <tr>
    <td>type</td>
    <td>string</td>
    <td>the proportional split between A/B (currently only <code>50/50</code>, <code>80/20</code>, and <code>100</code> is supported)</td>
  </tr>
  <tr>
    <td>groups</td>
    <td>array</td>
    <td>jagged array defining the A/B groups that each module belongs to</td>
  </tr>
</table>


## Global
For a global A/B test, some proportion of all users will see module "A" while the remaining will see module "B". 

In the example below roughly half of all users will be shown a gated form (A) and the other half will see a form modal (B).


<h3>All Users Form/SiteGate Test - <a href="../examples/preview/ab-testing/global.html" target="_blank">Live Preview</a></h3>

<pre data-src="../examples/src/ab-testing/global.js"></pre>


## With Audience Targeting
A/B Testing can be combined with [audience targeting](targeting.md) to divide an audience into a 50/50 split. 

In the example below module "A" will be displayed to roughly half of the users in the `smt_new` audience, while the other half of the audience will be shown module "B".


### New Users Message Test

``` javascript
var moduleA = pathfora.Message({
  id: 'message-a',
  layout: 'slideout',
  msg: 'Message A'
});

var moduleB = pathfora.Message({
  id: 'message-b',
  layout: 'slideout',
  msg: 'Message B'
});

var ab = pathfora.ABTest({
  id: 'targeted-ab-test',
  type: '50/50',
  groups: [
    [ moduleA ],
    [ moduleB ]
  ]
});

var widgets = {
  target: [{
    segment: 'smt_new',
    widgets: [ moduleA, moduleB ]
  }]
};

pathfora.initializeABTesting([ ab ]);

// using the lytics callback assumes that window.liosetup exists and the lytics js tag is loaded after the pathfora config
window.liosetup.callback = function(){
  pathfora.initializeWidgets(widgets, 'YOUR LYTICS ACCOUNT ID');
};
```

## Testing
To determine which group a user should be assigned to, Pathfora generates a random value the first time they visit the page. This value gets saved as a cookie `PathforaTest_[id]` so that Pathfora knows which group the user is in on return visits. Since anyone visiting a page that contains A/B test modules should only see the modules from one group, there is no immediate visual way for developers to verify that both groups are working as expected. 

However, you can attempt to test that both groups are showing correctly by finding and deleting the cookie named `PathforaTest_[id]` and refreshing the page. It may take a couple tries to show the other group since you are randomly assigned to a group each time. Feel free to try this on the [global example above](examples/preview/ab-testing/global.html).
