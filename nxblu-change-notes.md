# Updating to "nxblu" CSS

Major OE CSS version change: 5.x.x to 6.x.x

## Overview

1. Update newblue CSS files with nxblu CSS files
2. Update OE panel with new UI buttons to allow User to change themes
3. Manage theme classes on `<html>`
4. Preload fonts (optional)

> iDG is setup to demo all the following...

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

### Print / PDF CSS 

99% sure it's ok to switch over to nxblu for the Print / PDF for the headless chrome, however it's impossible to fully test this one on iDG.

```html
<!-- newblue current -->
<link rel="stylesheet" type="text/css" href="/newblue/dist/css/edge_style_oe_print.3.css">
<!-- nxblu -->
<link rel="stylesheet" href="/nxblu/dist/css/6.0.0_oe_print.css">
```



---

### 2) UI theme change buttons

Replace the current theme change link text with the following buttons

```html
<div class="select-oe-theme">
    <button type="button" id="js-set-theme-light" class="light-theme">Light theme</button>
    <button type="button" id="js-set-theme-dark" class="dark-theme">Pro theme</button>
</div>
```

JS is only required to change the class on `<html>` to update the UI theme  
*(Obviously you'll need to add the server cookie storage for the User)*  
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

### 3) HTML tag must have a theme class:

```html
<html lang="en" class="theme-light">
<!-- or -->
<html lang="en" class="theme-dark">
```
---

### 4) Preloading fonts (optional)
iDG is using this in `<head>` as it helps with font flickering, the next stage would be to implement the Font API properly... but for now (need to allow caching):
```html
<!-- preload common custom fonts -->
<link rel="preload" href="/nxblu/dist/fonts/roboto-subset/100-thin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/nxblu/dist/fonts/roboto-subset/300-light.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/nxblu/dist/fonts/roboto-subset/400-latin-greek.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/nxblu/dist/fonts/roboto-subset/500-latin-greek.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/nxblu/dist/fonts/roboto-subset/700-latin-greek.woff2" as="font" type="font/woff2" crossorigin>
```

---

### nxblu version 6.0.0

nxblu 6.0.0 is the updated version of newblue 5.13.10, it has removed several old and redundant CSS approaches that were still being supported in newblue but should no longer be used in the DOM







