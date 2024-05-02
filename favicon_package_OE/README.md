# Favicon for OE

(updated 2024)

### Recommend implementation for favicon
- Copy all the files (except this README) into the root directory for the site
- Add the following HTML into the `<head>`

```
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest" crossorigin="use-credentials">
```

### 'Training' mode
When OE is in training mode update SVG icon to:
```
<link rel="icon" href="/favicon-training.svg" type="image/svg+xml">
```

