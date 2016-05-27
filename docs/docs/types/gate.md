A more invasive approach to data collection or user identification. This type of module prevents users from viewing content or navigating until some sort of data has been collected and processed. Highly effective when promoting white papers or other online materials that are not to be freely available.

``` javascript
var module = pathfora.SiteGate({
	// module settings
});
```
## SiteGate

### SiteGate - [Live Preview](../../examples/preview/types/gate/gate.html)

![Site Gate](../examples/img/types/gate/gate.png)

<pre data-src="../../examples/src/types/gate/gate.js"></pre>


## showSocialLogin

With social login enabled, a module can show Google or Facebook login buttons which the user can use to connect to their account. This will autofill the form elements with their account information such as name and email.

| Value | Type | Behavior |
|---|---|---|
| false | boolean | `default` do not show social login buttons |
| true | boolean | show social login buttons |  

### Social Login /w Google & Facebook - [Live Preview](../../examples/preview/types/gate/social.html)

![Site Gate](../examples/img/types/gate/social.png)

<pre data-src="../../examples/src/types/gate/social.js"></pre>