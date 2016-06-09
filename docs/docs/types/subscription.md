Subscription modules are a lite version of the form type focused on gathering the minimum amount of user data necessary to maintain communication. By default only email address will be collected by a subscription module.

``` javascript
var module = pathfora.Subscription({
  id: 'my-subscription-module-id',
  headline: 'My Headline Text',
  msg: 'My message text here.'
});

pathfora.initializeWidgets([ module ]);
```

## layout

Define which layout type the form module should use.

| Value | Type | Behavior |
|---|---|---|
| modal | string | module uses a [modal layout](../layouts/modal.md) |
| slideout | string | module uses a [slideout layout](../layouts/slideout.md) |
| bar | string | module uses a [bar layout](../layouts/bar.md) |  

### Modal - [Live Preview](../../examples/preview/types/subscription/modal.html)

![Subscription Modal](../examples/img/types/subscription/modal.png)

<pre data-src="../../examples/src/types/subscription/modal.js"></pre>


### Slideout - [Live Preview](../../examples/preview/types/subscription/slideout.html)

![Subscription Slideout](../examples/img/types/subscription/slideout.png)

<pre data-src="../../examples/src/types/subscription/slideout.js"></pre>


### Bar - [Live Preview](../../examples/preview/types/subscription/bar.html)

![Subscription Bar](../examples/img/types/subscription/bar.png)

<pre data-src="../../examples/src/types/subscription/bar.js"></pre>
