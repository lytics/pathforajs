For multiple modules with common elements we can define a configuration to apply to all modules, or all modules of a certain type. Maintaining a config helps reduce the code repitition and allows you to change settings accross many widgets in one place. A general config object can be passed as third, optional argument to `initializeWidgets`.

``` javascript
var config = {
  // general config settings
};

// Lytics Account ID can be an empty string if not used for targeting
pathfora.initializeWidgets([ module, module2 ], "", config);
```

## generic

## message

## form

## subscription

## sitegate
