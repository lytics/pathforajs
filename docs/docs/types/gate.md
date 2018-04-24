Gate modules provide an approach for requiring data collection or user identification. This type of module prevents users from viewing content or navigating until some sort of data has been collected and processed. These modules are highly effective when promoting white papers or other online materials that are not to be freely available.

``` javascript
var module = new pathfora.SiteGate({
  id: 'my-gate-module-id',
  headline: 'My Headline Text',
  msg: 'My message text here.'
});

pathfora.initializeWidgets([module]);
```

## Gate

Gate modules will remain hidden once the user has submitted their information once. A cookie `PathforaUnlocked_[id of module]` is created to save this status so that the user has access to the gated content as long as their cookies persist.

<h3>SiteGate - <a href="../../examples/preview/types/gate/gate.html" target="_blank">Live Preview</a></h3>

![Gate Module](../examples/img/types/gate/gate.png)

<pre data-src="../../examples/src/types/gate/gate.js"></pre>

## showForm

By default the a gate module includes a form, with this setting it can be hidden for a text-only gated widget.

<table>
  <thead>
    <tr>
      <td colspan="2" align="center"><code>showForm</code> boolean</td>
    </tr>
    <tr>
      <th>Value</th>
      <th>Behavior</th>
    </tr>
  </thead>
  
  <tr>
    <td>true</td>
    <td><code>default</code> show the gated form</td>
  </tr>
  <tr>
    <td>false</td>
    <td>hide the form for a text-only gated widget</td>
  </tr>
</table>

<h3>Text-only Gate - <a href="../../examples/preview/types/gate/showForm.html" target="_blank">Live Preview</a></h3>

![Text Only Gate Module](../examples/img/types/gate/showForm.png)

<pre data-src="../../examples/src/types/gate/showForm.js"></pre>