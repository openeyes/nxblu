# Updating to "nxblu" CSS

Major OE CSS version change: 5.x.x to 6.x.x

## Overview

1. Update newblue CSS files with nxblu CSS files
2. Update OE panel with new UI buttons to allow User to change themes
3. Manage theme classes on `<html>`

> iDG is setup to demo the following...

### 1) CSS and `<head>` changes

Replace the 2 light and dark CSS files:

```html
<link rel="stylesheet" type="text/css" data-theme="dark" href="/assets/2ab3e0f0/dist/css/style_oe_dark.3.css" media="none">
<link rel="stylesheet" type="text/css" data-theme="light" href="/assets/2ab3e0f0/dist/css/style_oe_light.3.css">
```

With these updated CSS files from `nxblue/dist/css`:  
**important: match the media attributes, do not change these**

```html
<link href="/nxblu/dist/css/style_openeyes.css" rel="stylesheet" media="screen">
<link href="/nxblu/dist/css/style_block-browser-print.css" rel="stylesheet" media="print">
```

Also update: `style_eyedraw_doodles.css` to `nxblu/dist/css/`  
*(btw. this only provides CSS for the doodle icons so it only needs loading when a User is editing an Eyedraw)*

### Print CSS: `style_oe_print.3.css`

This file is available in nxblu **but** I advise to continue to use the current one from newblue for now until you are ready to move this over - the PDF/Printing is impossible to fully test on iDG.


---

## UI theme change buttons

Replace the current theme change link text with the following buttons

```html
<div class="select-oe-theme">
    <button type="button" id="js-set-theme-light" class="light-theme">Light theme</button>
    <button type="button" id="js-set-theme-dark" class="dark-theme">Pro theme</button>
</div>
```

JS is only required to change the class on `<htm>` to update the UI theme *(obviously you'll need to add the server cookie storage for the User)*  
e.g.

```js
const darkBtn = document.getElementById("js-set-theme-dark");
const lightBtn = document.getElementById("js-set-theme-light");

/** Change the theme class on <html> */
const switchTheme = ( theme ) => {
	document.documentElement.className = `theme-${theme}`;
};

darkBtn.onclick = () => switchTheme("dark");
lightBtn.onclick = () => switchTheme("light");
```

HTML tag must always be set to a theme:

```html
<html lang="en" class="theme-light">
<!-- or -->
<html lang="en" class="theme-dark">
```
---

### nxblu version 6.0.0

nxblu 6.0.0 is currently tracking the latest version of newblue (5.13.10) until OE switches over. 







