Gate modules prevents users from viewing content or navigating until the user interacts with the content of the gate. Similar to the Modal layout, but without the "x" option to close it. These modules are highly effective when promoting white papers or other online materials that are not to be freely available.

```javascript
var module = new pathfora.Message({
  id: 'my-gate-module-id',
  layout: 'gate',
  headline: 'My Headline Text',
  msg: 'My message text here.',
});

pathfora.initializeWidgets([module]);
```

## Gate

Gate modules will remain hidden once the user has submitted their information once. A cookie `PathforaUnlocked_[id of module]` is created to save this status so that the user has access to the gated content as long as their cookies persist.

<h3>SiteGate - <a href="../../examples/preview/layouts/gate/gate.html" target="_blank">Live Preview</a></h3>

![Gate Module](../examples/img/layouts/gate/gate.png)

<pre data-src="../../examples/src/layouts/gate/gate.js"></pre>
