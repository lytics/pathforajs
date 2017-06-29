The `displayConditions` key controls how, when, and for how long any single module is displayed/hidden. All options can be combined with one another for maximum control. Each module requires its own set of `displayConditions`. By default all modules will leverage `showOnInit`. Once other display conditions are set, they will override this default.


``` javascript
var module = new pathfora.Message({
  displayConditions: {
    showDelay: 10,
    impressions: {
      session: 2
    }
  }
});

pathfora.initializeWidgets([module]);
```

Some display conditions may require that cookies be enabled to work properly.

## showOnInit
Determines if the rendered module is displayed as soon as it is initialized or waits for another event.

<table>
  <thead>
    <tr>
      <td colspan="2" align="center"><code>showOnInit</code> boolean</td>
    </tr>
    <tr>
      <th>Value</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>true</td>
    <td><code>default</code> module will be displayed as soon as it has been loaded</td>
  </tr>
  <tr>
    <td>false</td>
    <td>module will be added to DOM but not displayed until another trigger instructs it to</td>
  </tr>
</table>

``` javascript
// example: loads immediately after initializing the module

displayConditions: {
  showOnInit: true
}
```

## showDelay
Adds a delay, in seconds, that must be completed before module is loaded.

<table>
  <thead>
    <tr>
      <td colspan="2" align="center"><code>showDelay</code> int</td>
    </tr>
    <tr>
      <th>Value</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>0</td>
    <td><code>default</code> using 0 disables the showDelay property and will show immediately</td>
  </tr>
  <tr>
    <td>0 – ∞</td>
    <td>module will be displayed after waiting x seconds after initialization</td>
  </tr>
</table>


``` javascript
// example: loads after a 10 second delay

displayConditions: {
  showDelay: 10
}
```

## showOnMissingFields
By default, a module will be hidden if tried to include an [entity field](customization/entity_fields.md) that the user does not have. showOnMissingFields can override this beahvior.

<table>
  <thead>
    <tr>
      <td colspan="2" align="center"><code>showOnMissingFields</code> int</td>
    </tr>
    <tr>
      <th>Value</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>false</td>
    <td><code>default</code> module will be hidden if the field does not exist and no fallback is defined</td>
  </tr>
  <tr>
    <td>true</td>
    <td>module will show regardless of the missing field value, and the template will be replaced by an empty string.</td>
  </tr>
</table>


``` javascript
displayConditions: {
  showOnMissingFields: true
}
```

## hideAfter
Adds a countdown, in seconds, that must hides module on expiration.

<table>
  <thead>
    <tr>
      <td colspan="2" align="center"><code>hideAfter</code> int</td>
    </tr>
    <tr>
      <th>Value</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>0</td>
    <td><code>default</code> using 0 disables the showDelay property and will not be hidden</td>
  </tr>
  <tr>
    <td>0 – ∞</td>
    <td>module will hidden from screen after x seconds have passed</td>
  </tr>
</table>

``` javascript
// example: hide module after 10 seconds

displayConditions: {
  hideAfter: 10
}
```

## displayWhenElementVisible
Triggers the module when a specific DOM element enters the viewport.

<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>displayWhenElementVisible</td>
    <td>string</td>
    <td>selector for the element which when visible will trigger the module</td>
  </tr>
</table>


``` javascript
// example: show module when the .footer is visible

displayConditions: {
  displayWhenElementVisible: '.footer'
}
```

## scrollPercentageToDisplay
Triggers the modal after a percentage of the page scroll has been performed.

<table>
  <thead>
    <tr>
      <td colspan="2" align="center"><code>scrollPercentageToDisplay</code> int</td>
    </tr>
    <tr>
      <th>Value</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>0</td>
    <td><code>default</code> using 0 disables the property and will show immediately</td>
  </tr>
  <tr>
    <td>0 – 100</td>
    <td>module will hidden until x percent of total scroll has been performed</td>
  </tr>
</table>

``` javascript
// example: show module when the 50 percent of the page scroll has been completed

displayConditions: {
  scrollPercentageToDisplay: 50
}
```

## pageVisits
Triggers the module when the user visits the page a certain amount of times. The total number of page visits is saved in cookie `PathforaPageView` to compare against this value.

<table>
  <thead>
    <tr>
      <td colspan="2" align="center"><code>pageVisits</code> int</td>
    </tr>
    <tr>
      <th>Value</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>0</td>
    <td><code>default</code> using 0 disables the property and will show on all visits</td>
  </tr>
  <tr>
    <td>0 – ∞</td>
    <td>module will show only when the user has visited more than x times</td>
  </tr>
</table>

``` javascript
// example: show module after they have visited at least 3 times

displayConditions: {
  pageVisits: 3
}
```

## date
Display the module in a specified interval of time.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>date</code> object</td>
    </tr>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>start_at</td>
    <td>string</td>
    <td><code>optional</code> valid ISO 8601 formatted date for date to start showing module</td>
  </tr>
  <tr>
    <td>end_at</td>
    <td>string</td>
    <td><code>optional</code> valid ISO 8601 formatted date for date to stop showing module</td>
  </tr>
</table>

``` javascript
// example: show module starting February 12, 2017

displayConditions: {
  date: {
    start_at: '2017-02-12T11:00:00.000Z'
  }
}
```

``` javascript
// example: hide module starting February 12, 2017

displayConditions: {
  date: {
    end_at: '2017-02-12T11:00:00.000Z'
  }
}
```

``` javascript
// example: show module between February 12, 2017 and March 12, 2017

displayConditions: {
  date: {
    start_at: '2017-02-12T11:00:00.000Z',
    end_at: '2017-03-12T11:00:00.000Z'
  }
}
```

## priority
Module priority helps prevent overlap between multiple modules on a page. If unset, the module will show as normal, regardless of other modules priorities.

**For example**: module A has a priority of 1 and is targeted to show to the audience "High Value Users".

module B has a priority of 0 is targeted to "Returning Users".

If the user is a member of both audiences, only module A will show assuming all of it's other display conditions are met, because module B is lower priority.

<table>
  <thead>
    <tr>
      <td colspan="2" align="center"><code>priority</code> int</td>
    </tr>
    <tr>
      <th>Key</th>
      <th>Type</th>
    </tr>
  </thead>

  <tr>
    <td style="min-width: 97px;">0 – ∞</td>
    <td>modules with a higher value will be prioritized to show instead of modules with lower numbers assuming targetting requirements and all other page-load level display conditions are met</td>
  </tr>
</table>

``` javascript
// example: module is higher priority than any other module with a priority less than 2.

displayConditions: {
  priority: 2
}
```



## impressions
Hide the module after a certain number of impressions. The current number of impressions is saved in a cookie `PathforaImpressions_[module id]` to compare against this value.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>impressions</code> object</td>
    </tr>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>session</td>
    <td>int</td>
    <td><code>optional</code> count of how many session-based impressions before showing the module</td>
  </tr>
  <tr>
    <td>total</td>
    <td>int</td>
    <td><code>optional</code> count of how many total (multisession) impressions before showing the module</td>
  </tr>
</table>

``` javascript
// example: hide module after the second impression in the same session

displayConditions: {
  impressions: {
    session: 2
  }
}
```

``` javascript
// example: hide module after five total impressions

displayConditions: {
  impressions: {
    total: 5
  }
}
```

``` javascript
// example: hide the module after the second impression in the same session
// or if it has been seen five times ever

displayConditions: {
  impressions: {
    session: 2,
    total: 5
  }
}
```


## hideAfterAction
Hide the module after a particular action has been taken (`closed`, `cancel`, or `confirm`). The current number of impressions is saved in a cookie `Pathfora[action]_[module id]` to compare against this value.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>hideAfterAction</code> object</td>
    </tr>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>closed</td>
    <td>object</td>
    <td><code>optional</code> settings for hiding the module based on the close action</td>
  </tr>
  <tr>
    <td>cancel</td>
    <td>object</td>
    <td><code>optional</code> settings for hiding the module based on the cancel button click action</td>
  </tr>
  <tr>
    <td>confirm</td>
    <td>object</td>
    <td><code>optional</code> settings for hiding the module based on the confirm button action</td>
  </tr>
</table>

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>closed</code> / <code>confirm</code> / <code>cancel</code> object</td>
    </tr>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>hideCount</td>
    <td>int</td>
    <td><code>optional</code> count of times module has been closed manually by user before hiding the module</td>
  </tr>
  <tr>
    <td>duration</td>
    <td>int</td>
    <td><code>optional</code> how long the module should be hidden in seconds</td>
  </tr>
</table>


``` javascript
// example: hide module for 6 minutes after 5th close

displayConditions: {
  hideAfterAction: {
    closed: {
      hideCount: 5,
      duration: 60 * 6
    }
  }
}
```

``` javascript
// example: hide module permanently after confirmation has been clicked

displayConditions: {
  hideAfterAction: {
    confirm: {
      hideCount: 1
    }
  }
}
```

``` javascript
// example: hide module for 1 week after cancel has been clicked

displayConditions: {
  hideAfterAction: {
    cancel: {
      hideCount: 1,
      duration: 60 * 60 * 24 * 7
    }
  }
}
```

``` javascript
// example: all of the above

displayConditions: {
  hideAfterAction: {
    cancel: {
      hideCount: 1,
      duration: 60 * 60 * 24 * 7
    },
    confirm: {
      hideCount: 1
    },
    closed: {
      hideCount: 5,
      duration: 60 * 6
    }
  }
}
```

## showOnExitIntent

Only display the module when the user is about to leave the page.

<table>
  <thead>
    <tr>
      <td colspan="2" align="center"><code>showOnExitIntent</code> boolean</td>
    </tr>
    <tr>
      <th>Value</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>true</td>
    <td>module will be displayed as soon as the user is about to leave the page.</td>
  </tr>
  <tr>
    <td>false</td>
    <td><code>default</code> module will be displayed either on init or when manually invoked, depending on <code>showOnInit</code></td>
  </tr>
</table>

``` javascript
// example: loads immediately after initializing the module

displayConditions: {
  showOnExitIntent: true
}
```

<h3>Exit Intent Modal - <a href="../examples/preview/config/exitIntentModal.html" target="_blank">Live Preview</a></h3>

## manualTrigger

Control when a module is triggered with javascript. Use this displayCondition in conjunction with the [triggerWidgets](api/methods.md#triggerWidgets).

<table>
  <thead>
    <tr>
      <td colspan="2" align="center"><code>manualTrigger</code> boolean</td>
    </tr>
    <tr>
      <th>Value</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>true</td>
    <td>module will be displayed when <a href="../api/methods/#triggerWidgets">triggerWidgets</a> method is called.</td>
  </tr>
  <tr>
    <td>false</td>
    <td><code>default</code> module will be displayed either on init or when manually invoked, depending on <code>showOnInit</code></td>
  </tr>
</table>

``` javascript
// example: this script alone will not display the module

var module = new pathfora.Message({
  id: 'trigger-message',
  layout: 'modal',
  msg: 'You clicked the button!',
  displayConditions: {
    manualTrigger: true
  }
});

pathfora.initializeWidgets([module]);
```

```html
<!-- module will display when the user clicks this button -->
<input type="submit" value="Click to display module" onclick="pathfora.triggerWidgets(['trigger-message'])">
```


## urlContains

Only display the module on pages that match the url conditions defined.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center">object in <code>urlContains</code> array</td>
    </tr>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>match</td>
    <td>string</td>
    <td><code>optional</code> name of the matching rule (see below)</td>
  </tr>
  <tr>
    <td>value</td>
    <td>string</td>
    <td>value to match the current page url against</td>
  </tr>
  <tr>
    <td>exclude</td>
    <td>boolean</td>
    <td><code>optional</code> if true, the module will not display on any page that matches this rule</td>
  </tr>
</table>

<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>match</code> string</td>
    </tr>
    <tr>
      <th>Value</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>simple</td>
    <td>string</td>
    <td><code>default</code> fuzzy match that removes the URL protocol and query string before matching</td>
  </tr>
  <tr>
    <td>exact</td>
    <td>string</td>
    <td>the url must match what is typed exactly: protocol, query params, etc.</td>
  </tr>
  <tr>
    <td>string</td>
    <td>string</td>
    <td>sub-string match against the url</td>
  </tr>
  <tr>
    <td>regex</td>
    <td>string</td>
    <td>evaluates regex against the url</td>
  </tr>
</table>

``` javascript
// example: simple match

displayConditions: {
  urlContains: [
    {
      match: 'simple',
      value: 'www.getlytics.com'
    }
  ]
}

// Matches:
// https://www.getlytics.com
// http://www.getlytics.com
// http://www.getlytics.com?ad_campaign=1ed387faed

// Doesn't Match:
// http://www.getlytics.com/blog
// https://activate.getlytics.com
```

``` javascript
// example: exact match

displayConditions: {
  urlContains: [
    {
      match: 'exact',
      value: 'https://www.getlytics.com/resources?id=a763efd12c'
    }
  ]
}

// Matches:
// https://www.getlytics.com/resources?id=a763efd12c

// Doesn't Match:
// http://www.getlytics.com/resources?id=a763efd12c
// https://getlytics.com/resources?id=a763efd12c
// https://www.getlytics.com/resources?id=a763efd12c&something=that-will-404
```

``` javascript
// example: string match

displayConditions: {
  urlContains: [
    {
      match: 'string',
      value: '/blog/'
    }
  ]
}

// Matches:
// http://www.getlytics.com/blog/
// http://getlytics.com/blog/some-post-in-the-past
// https://www.getlytics.com/blog/tag/customer-data-platform?referrer=thegreatgoogle

// Doesn't Match:
// https://www.getlytics.com/
// http://getlytics.com/careers
```

``` javascript
// example: regex match

displayConditions: {
  urlContains: [
    {
      match: 'regex',
      value: '\/integrations\/.+?\?.*?ref=our_partner'
    }
  ]
}

// Matches:
// http://www.getlytics.com/integrations/campaignmonitor?ref=our_partner
// http://www.getlytics.com/integrations/campaignmonitor?session=125929&ref=our_partner
// https://www.getlytics.com/blog/tag/customer-data-platform?referrer=thegreatgoogle

// Doesn't Match:
// http://www.getlytics.com/integrations/campaignmonitor?ref=some_stranger
// http://www.getlytics.com/integrations?ref=our_partner
// http://www.getlytics.com/blog/adroll?session=125929&ref=our_partner
```


## metaConatins

Only display the module on pages that have meta tags that match the conditions defined.

Note that metaContains does not support partial matches as urlContains does. Treat metaContains values as having the exact match rule.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center">object in <code>metaContains</code> array</td>
    </tr>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>

  <tr>
    <td>property</td>
    <td>string</td>
    <td><code>optional</code> property attribute of the meta tag</td>
  </tr>
  <tr>
    <td>content</td>
    <td>string</td>
    <td><code>optional</code> value of the content attribute of the meta tag to match against</td>
  </tr>
  <tr>
    <td>name</td>
    <td>string</td>
    <td><code>optional</code> name attribute of the meta tag</td>
  </tr>
</table>

``` javascript
// example match based on og:type

displayConditions: {
  metaContains: [
    {
      property: 'og:type',
      content: 'website'
    }
  ]
}

// Matches:
// <meta property="og:type" content="website" />
```