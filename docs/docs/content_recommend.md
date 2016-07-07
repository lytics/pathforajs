Lytics content recommendations are now supported as a **beta** feature in Pathfora. Instead of hand selecting content to show an audience, you can can create a module that will suggest content at a individual level, based on the viewer's content affinities in Lytics. If you would like to try out this feature _please_ contact your customer success representative `success@lytics.io` to help set this up.

Content recommendations in Pathfora require your [Lytics Account ID](/api/acctid.md) to be used as a parameter to the [initializeWidgets](/api/methods.md#initializewidgets) method. This account id is used to acess the Lytics content recommendation API to return content suggestions from your account.

**Note**: only [Message](/types/message.md) modules using a [slideout](/layouts/slideout.md) or [modal](/layouts/modal.md) layout and a [variant](/layouts/modal.md#variant) of `3` support content recommendations.

## recommend

Recommend controls any parameters necessary for making a content suggestions to a user using the Lytics content recommendation API. Your Lytics account ID must be present in the call to [initializeWidgets](/api/methods.md#initializewidgets) for content recommendation modules.


<table>
  <thead>
    <tr>
      <td colspan="3" align="center"><code>recommend</code> object</td>
    </tr>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>
  
  <tr>
    <td>ql</td>
    <td>string</td>
    <td>formatted query to filter based on url, topic or other content variables*</td>
  </tr>
</table>

*Contact your customer success representative `success@lytics.io` for assistance in writing a filter to recommend based on url matching, topic relevance, and/or meta attributes.

## content

Content acts as a backfill/helper for the [recommend key](#recommend). If the content recommendation API cannot return a recommendation for the user (if they don't have any content affinity data or an error occurs), a default document may be provided.

<table>
  <thead>
    <tr>
      <td colspan="3" align="center">object in <code>content</code> array</td>
    </tr>
    <tr>
      <th>Key</th>
      <th>Type</th>
      <th>Behavior</th>
    </tr>
  </thead>
  
  <tr>
    <td>url</td>
    <td>string</td>
    <td>url of the default document to recommend to the user</td>
  </tr>
  <tr>
    <td>title</td>
    <td>string</td>
    <td>meta title of the default document</td>
  </tr>
  <tr>
    <td>description</td>
    <td>string</td>
    <td>meta description of the default document</td>
  </tr>
  <tr>
    <td>image</td>
    <td>string</td>
    <td>url of the meta image of the default document</td>
  </tr>
  <tr>
    <td>default</td>
    <td>boolean</td>
    <td><code>required</code> true if the content provided is to be used should the recommendation fail</td>
  </tr>
</table>

**Note:** The examples below will show the default content in this case since a valid account ID is not provided.

<h3>Content Recommendation Modal - <a href="../../examples/preview/layouts/modal/contentRecommend.html" target="_blank">Live Preview</a></h3>

![Content Recommendation Modal Module](../examples/img/layouts/modal/contentRecommend.png)

<pre data-src="../../examples/src/layouts/modal/contentRecommend.js"></pre>

<h3>Content Recommendation Slideout - <a href="../../examples/preview/layouts/slideout/contentRecommend.html" target="_blank">Live Preview</a></h3>


![Content Recommendation Modal Module](../examples/img/layouts/slideout/contentRecommend.png)

<pre data-src="../../examples/src/layouts/slideout/contentRecommend.js"></pre>