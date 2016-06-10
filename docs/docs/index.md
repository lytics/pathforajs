Pathfora JS is a lightweight SDK for displaying personalized modules on your website. It integrates with your [Lytics](http://www.getlytics.com/) account to track user actions, and conditionally display modules based on your users' audience memebership. This documentation will walk you through everything you need to create your own highly customized and personalized module. Code and live preview examples are provided along the way.

## Getting Started
Before you begin creating modules with Pathfora you must add the [Lytics javascript tag](https://activate.getlytics.com/#/documentation/jstag_anon) to your website. If you are using [Lytics Personalization](#) to power your modules, Pathfora will be automatcally loaded through your Lytics javascript tag. If you're creating a custom module, the Pathfora tag must be loaded after the Lytics tag.

``` html
<!-- Your Lytics JS Tag -->
<script src="https://c.lytics.io/api/tag/YOUR LYTICS ACCOUNT ID/lio.js"></script>

<!-- Pathfora Tag -->
<script src="http://c.lytics.io/static/pathfora.min.js"></script>
```

Next you'll need to set up configuration for your module and initialize it with `initializeWidgets`. Example configurations, settings, and their outputted modules can be found throughout the documentation.

## Overview
Here are a couple sections to get you started on the basics of Pathfora JS. See the navigation in the sidebar for a full list of docs.

- **[API Reference](api/methods.md)** 
> This section acts as a reference for Pathfora's top level functions which will use the module configs you create use to deploy modules on your website.

- **[Types](types/message.md)** 
> The type parameter relays information to the layout (see below) related to the type of content being rendered. Pathfora currently supports four types of modules: message, form, subscription and gate.

- **[Layouts](layouts/modal.md)**
> The layout controls the style (what does the module look like & how does it animate into view). Pathfora currently supports four different layouts for each of the types: modal, slideout, bar, and button.

- **[Audience Targeting](targeting.md)**
> This section will walk you through how to make your modules truly personalized by targeting them to a specific subset of your users as defined by your Lytics audiences.

- **[Display Conditions](display_conditions.md)**
> Display conditions can control when the module is displayed based on the current date, previous actions of the user, current scroll position on the page, and many more settings.

- **[Customization](customization/themes.md)** 
> Here we cover a few of the options for basic to full customization of the settings such as button and field names, color themes, look and feel.