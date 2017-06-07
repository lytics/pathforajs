If you have a whitelisted entity fields in Lytics or a custom data field in javascript, you can include them in your message, headline, image, or confirm callback function field using a simple template that pathfora will recognize and replace with field data. These dynamic field templates allow you to further personalize the customer experience of your module.

# Entity Field Templates

Any field that is available via `window.lio.data` can be placed into a module's message, headline, or image. For example, if you wanted to include the user's name in the headline of a module:

```javascript
var module = new pathfora.Message({
  id: 'welcome-back',
  layout: 'modal',
  headline: 'Welcome back, {{name}}.',
  msg: 'Thanks for returning. Please check out our new products.'
});

pathfora.initializeWidgets([module]);
```

Pathfora will attempt to replace `{{name}}` with the value of `window.lio.data.name`. Similarly, if you wanted to include a subfield, you can use dot notation in the template. `{{last_cta.resource}}` would be replaced with the value of `window.lio.data.last_cta.resource`.

In addition to using Lytics entity fields, you can pass pathfora the value of a field to include in a module using the `window.pathfora.customData` object: 

```javascript
pathfora.customData.name = 'Jon Snow';
```

For example, if a user submits a form on your website asking for their info and you would like to immediately use this data in a module, you can add it to the customData object before initializing the widget and use an entity field template.

If the data isn't present for the user viewing the modal there are a couple options available to control the behavior of the module. By default if there is no fallback defined for the field, pathfora will prevent the module from being displayed for visitors who lack the necessary fields. This behavior can be changed with the [showOnMissingFields](/display_conditions.md#showonmissingfields) display condition.

# Defining a Fallback (default) Value

Alternatively, we can define a fallback or "default" value to be shown in case the user is missing the data. To define a fallback value, place it after the field name and a `|` character in the template. Building from the previous example:

```javascript
var module = new pathfora.Message({
  id: 'welcome-back',
  layout: 'modal',
  headline: 'Welcome back, {{name | Valued Customer}}.',
  msg: 'Thanks for returning. Please check out our new products.'
});

pathfora.initializeWidgets([module]);
```

In this example all visitors who lack the "name" field will be greeted with "Wecome back, Valued Customer".