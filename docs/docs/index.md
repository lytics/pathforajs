## What is Pathfora JS?
[TODO: NEEDS OVERVIEW CONTENT]

[What is a type?](types/message.md)  
Each individual module initialized is linked to single type. This type relays information to the layout (information below) related to the type of content being rendered. Pathfora currently supports four(4) types of modules as described in detail througout this documentation: message, form, subscription and gate.

[What are layouts?](layouts/modal.md)  
The layout parameter does the heavy lifting when it comes to rendering the actual module. This controls the position (where the module is renderd) and the style (what does the module look like & how does it animate into view). Pathfora currently supports six (6) different layouts for each of the types: modal, slideout, bar, button, folding, inline. Specifics on positioning as well as restrictions can be found in each layouts specific documentation. 

[What are display conditions?](display_conditions.md)  
The final piece of the module puzzle comes in the form of display conditions. These conditions, for the most part, control when a module is displayed. Scroll position, number of sessions and time delay are a very small sample of the various methods built into Pathfora for triggering a module for display.

[How much can I customize?](customization.md)  
Though there is a set of universal out-of-the-box styles included with Pathora the output is extremely customizable. Here we cover a few of the options for basic to full customization of the look and feel.

## Getting Started
install gulp  
`npm install --global gulp-cli`

## For Developers

How we build documentation
--------------------------

When we import your documentation, we look at two things first: your *Repository URL* and the *Documentation Type*.
We will clone your repository,
and then build your documentation using the *Documentation Type* specified.

Sphinx
~~~~~~
