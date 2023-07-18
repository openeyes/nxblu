# OE CSS ("nxblu")

### "nxblu" is the next major CSS release for OpenEyes

## Browser support

* Chrome > 89
* Edge > 89
* Safari > 15

### Notes

* Try to keep selectors short and shallow.
* Use kebab-case for classnames (e.g. `.btn-dropdown`)
* Avoid ID's for styling. It avoids specificity issues (although, some top level elements are - for historical reasons)
* Generally, try and use a two level object orientated approach. 
* Generally, use descriptive useful classnames.
* Generally, avoid qualifying class names with type selectors e.g. `div.myclass` (Unless you want the class to be bound to a specific DOM element)
* Never use `!important` (unless you really, really have too...)

### `js-` JS class hooks

* CSS classes _only_ used by JS (i.e. not being used by CSS to style the UI) should be prefixed with `js-`.


## Iconography

* Event icons must be 76px x 76px, and named correctly.
* Eyedraw icon (doodles) must be 32px x 32px, and named correctly.
* SVGs are used in a few different flavours, best to see source for examples.

## Please do not use inline styles for adjusting styling

**Why not?** For the following reasons:

1. Inline DOM styling* is problematic with theming
2. Responsive layout (UI responsiveness is highly bespoke)
3. UI consistency (consistent data presentation has many, many benefits)
4. Probably unnecessary; somewhere in OE there is possibly a UI solution already available!
5. Flagging up UI issues with the CSS helps to improve the overall UI across the board

_(*To be clear, we are not talking about JS positional stuff, but this does include z stacking which does need considering globally)_

### Finally...

The smallest supported device width is 1200px, with the UIX being tailored to run on handheld tablets, as well as on super-wide displays. 



