The `displayConditions` key controls how, when, and for how long any single module is displayed/hidden. All options can be combined with one-another for maximum control. Each module requires its own set of `displayConditions`. By default all modules will leverage `showOnInit`. Upon configuring another options this init based display is automatically disabled unless explicitly defined again in the module config.


``` javascript
var module = pathfora.Message({
  displayConditions: {
    // display conditions here
  }
});
```

## showOnInit
Determines if the rendered module is displayed as soon as it is initialized or waits for another event.

| Value | Type | Behavior |
|---|---|---|
| true | bool | `default` module will be displayed as soon as it has been loaded |
| false | bool | module will be added to DOM but not displayed until another trigger instructs it to |  

``` javascript
// example: loads immediately after initializing the module

displayConditions: {
  showOnInit: true
}
```

## showDelay
Adds a delay, in seconds, that must be completed before module is loaded.

| Value | Type | Behavior |
|---|---|---|
| 0 | int | `default` using 0 disables the showDelay property and will show immediately |
| 0 - ∞ | int | module will be displayed after waiting x seconds after initialization |  


``` javascript
// example: loads after a 10 second delay

displayConditions: {
  showDelay: 10
}
```

## hideAfter
Adds a countdown, in seconds, that must hides module on expiration.

| Value | Type | Behavior |
|---|---|---|
| 0 | int | `default` using 0 disables the showDelay property and will not be hidden |
| 0 - ∞ | int | module will hidden from screen after x seconds have passed |  

``` javascript
// example: hide module after 10 seconds

displayConditions: {
  hideAfter: 10
}
```

## displayWhenElementVisible
Triggers the module when a specific DOM element enters the viewport.

| Value | Type | Behavior |
|---|---|---|
| element id | string | waits for an element with specific id to enter the viewport |

``` javascript
// example: show module when the #footer is visible

displayConditions: {
  displayWhenElementVisible: "#footer"
}
```
  
## scrollPercentageToDisplay
Triggers the modal after a percentage of the page scroll has been performed.

| Value | Type | Behavior |
|---|---|---|
| 0 | int | `default` using 0 disables the property and will show immediately |
| 0 - 100 | int | module will hidden until x percent of total scroll has been performed |        

``` javascript
// example: show module when the 50 percent of the page scroll has been completed

displayConditions: {
  scrollPercentageToDisplay: 50
}
```
  
## pageVisits
Triggers the module when the user visits the page a certain amount of times (total saved in cookie).

| Value | Type | Behavior |
|---|---|---|
| 0 | int | `default` using 0 disables the property and will show on all visits |
| 0 - ∞ | int | module will show only when visits > x |        

``` javascript
// example: show module after they have visited at least 3 times

displayConditions: {
  pageVisits: 3
}
```

## date
Display the module in a specified interval of time.

<table>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td>date</td>
    <td>obj</td>
    <td>must be object formatted using following options / values</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3" align="center"><code>date</code> object</td>
  </tr>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td> start_at </td>
    <td>string</td>
    <td><code>optional</code> valid date string <code>2016-02-15T11:00:00.000Z</code> for date to start showing module</td>
  </tr>
  <tr>
    <td> end_at </td>
    <td>string</td>
    <td><code>optional</code> valid date string <code>2016-02-15T11:00:00.000Z</code> for date to stop showing module</td>
  </tr>
</table>
  
``` javascript
// example: show module starting February 12, 2017

displayConditions: {
  date: {
    start_at: "2017-02-12T11:00:00.000Z"
  }
}
```
  
``` javascript
// example: hide module starting February 12, 2017

displayConditions: {
  date: {
    end_at: "2017-02-12T11:00:00.000Z"
  }
}
```   

``` javascript
// example: show module between February 12, 2017 and March 12, 2017

displayConditions: {
  date: {
    start_at: "2017-02-12T11:00:00.000Z",
    end_at: "2017-03-12T11:00:00.000Z"
  }
}
```
  
## impressions
Hide the module after a certain number of impressions

<table>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td>impressions</td>
    <td>obj</td>
    <td>must be object formatted using following options / values</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3" align="center"><code>date</code> object</td>
  </tr>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td> session </td>
    <td>int</td>
    <td><code>optional</code> integer count of how many session-based impressions before showing the module</td>
  </tr>
  <tr>
    <td> total </td>
    <td>int</td>
    <td><code>optional</code> integer count of how many total (multisession) impressions before showing the module</td>
  </tr>
</table>

``` javascript
// example: hide module after the second impressions in the same session

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
// example: hide the module after the second impression in the same session or if it has been seen five times ever

displayConditions: {
  impressions: {
    session: 2,
    total: 5
  }
}
```
  
  
## hideAfterAction
Hide the module after a particular action has been taken (`closed, confirm, cancel`)

<table>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td>hideAfterAction</td>
    <td>obj</td>
    <td>must be object formatted using following options / values</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3" align="center"><code>closed</code> / <code>confirm</code> / <code>cancel</code> object</td>
  </tr>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td>hideCount</td>
    <td>int</td>
    <td><code>optional</code> integer count of times module has been closed manually by user</td>
  </tr>
  <tr>
    <td>duration</td>
    <td>int</td>
    <td><code>optional</code> integer representing how long the module should be hidden in seconds</td>
  </tr>
</table>


``` javascript
// example: hide module for 6 minutes after 5th close

displayConditions: {
  hideAfterAction: {
    closed: {
      hideCount: 5,
      duration: 360
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
      duration: 604800
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
      duration: 604800
    },
    confirm: {
      hideCount: 1
    },
    closed: {
      hideCount: 5,
      duration: 360
    }
  }
}
```


## urlContains

Only display the module on pages that match the url conditions defined.

<table>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
  <tr>
    <td>urlContains</td>
    <td>array</td>
    <td>must be an array of objects formatted using following options / values</td>
  </tr>
</table>

<table>
  <tr>
    <td colspan="3" align="center">object in <code>urlContains</code> array</td>
  </tr>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
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
</table>

<table>
  <tr>
    <td colspan="3" align="center"><code>match</code> string</td>
  </tr>
  <tr>
    <th>VALUE</th>
    <th>TYPE</th>
    <th>BEHAVIOR</th>
  </tr>
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