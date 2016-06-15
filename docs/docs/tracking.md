Pathfora can send tracking events and the user data submitted to Lytics and Google Analytics. As long as your tags are all set up in the correct order, module data will be sent automatically. Below we will look at which fields are sent in detail and their formats.

## Lytics
As long as your [Lytics javascript tag](https://activate.getlytics.com/resources/documentation/) is loaded before the Pathfora tag, all event data and data collected from modules with user input will be sent to the the stream [configured in your Lytics javascript tag](https://activate.getlytics.com/resources/documentation/jstag). The following raw data fields can be sent to Lytics by Pathfora.

| Attribute | Type | Value |
|---|---|---|
| `pf-widget-id` | string | id of the module set in the config |
| `pf-widget-type` | string | type of the module |
| `pf-widget-layout` | string | layout of the module |
| `pf-widget-variant` | int | variant of the module |
| `pf-widget-event` | string | name of the event (see below) |
| `pf-widget-action` | string | custom tracking names for button click events as defined in [confirmAction](/callbacks/#confirmaction) or [cancelAction](/callbacks/#cancelaction) |
| `pf-form-username` | string | user submitted value of "name" field on module |
| `pf-form-title` | string | user submitted value of "title" field on module |
| `pf-form-email` | string | user submitted value of "email" field on module |
| `pf-form-message` | string | user submitted value of "message" field on module |
| `pf-form-company` | string | user submitted value of "company" field on module |
| `pf-form-phone` | string | user submitted value of "phone number" field on module |


<table>
  <thead>
    <tr>
      <td colspan="2" align="center"><code>pf-widget-event</code> string</td>
    </tr>
    <tr>
      <th>Value</th>
      <th>Behavior</th>
    </tr>
  </thead>
  
  <tr>
    <td>show</td>
    <td>module was displayed to the user</td>
  </tr>
  <tr>
    <td>close</td>
    <td>module was closed by the user</td>
  </tr>
  <tr>
    <td>confirm</td>
    <td>"confirm" button was clicked by the user</td>
  </tr>
  <tr>
    <td>cancel</td>
    <td>"cancel" button was clicked by the user</td>
  </tr>
  <tr>
    <td>submit</td>
    <td>user submitted information from a <a href="../types/form">form module</a></td>
  </tr>
  <tr>
    <td>subscribe</td>
    <td>user submitted email from a <a href="../types/subscription">subscription module</a></td>
  </tr>
  <tr>
    <td>unlock</td>
    <td>user submitted information from a <a href="../types/gate">gate module</a></td>
  </tr>
</table>

To verify that the event data fields are being sent properly to Lytics, you can simulate an action by interacting with your module and checking that the expected fields exist in the data streams section of your Lytics Account.

By default these fields are available as user fields so that you can use them in the creation of segments. If you need help using these fields or would like to map the user fields differently please contact your customer success representative `success@getlytics.com`.


## Google Analytics

Pathfora will send event data from the modules on your website to your Google Analytics account as long as it has access to the `ga` function. This requires that you have the [analytics.js snippet](https://developers.google.com/analytics/devguides/collection/analyticsjs/) on your website loaded before the Pathfora tag. An event sent to Google Analytics by Pathfora will use the following attributes for [event tracking](https://developers.google.com/analytics/devguides/collection/analyticsjs/events#overview):

| Attribute | Type | Value |
|---|---|---|
| eventCategory | string | Lytics |
| eventAction | string | [id of module] : [event name] |

The `[event name]` signifier in eventAction will match the event names for the `pf-widget-event` field [sent to Lytics](#lytics), however if you've defined custom names in the [confirmAction](/callbacks/#confirmaction) or [cancelAction](/callbacks/#cancelaction) settings this will override the event name for those actions.
