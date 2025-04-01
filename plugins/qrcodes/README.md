# 🔳 QR Codes

> Custom plugin for [Reveal.js](https://revealjs.com/) to show QR Codes by adding a single class to HTML elements.

## How To

Simply include `RevealQRCodes` plugin

```js
Reveal.initialize({
  // ...
  plugins: [
    // ...,
    RevealQRCodes,
  ],
});
```
And add the required class and data attributes to HTML elements you'd like to turn into QR Codes

```html

<a href="https://example.com/" class="qrcode" data-size=500></a>

```

## Configuration

### Global Configuration

You can configure the plugin with the following options:

```js
// ...
plugins: [ /* ... */ ],
qrcodes: {
    selector: ".qrcode",
    size: 256,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctionLevel: "H"
}
```

| Name              | Type                                | Description                                                                                                                                                     | Default     |
| ----------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `selector`        | String                              | CSS selector to use when searching HTML elements to render as QR Codes                                                                                          | `".qrcode"` |
| `size`            | Number                              | Default size (Width and Height) to render QR Codes                                                                                                              | `256`       |
| `colorDark`       | String                              | Color to use for "dark" segments of QR Codes                                                                                                                    | `"#000000"` |
| `colorLight`      | String                              | Color to use for "light" segments  of QR Codes                                                                                                                  | `"#ffffff"` |
| `correctionLevel` | String                              | Correction level to include in the generated QR Codes. Follows this schema: `"L"` for `"Low"`, `"M"` for `"Medium"`, `"Q"` for `"Quartile"`, `"H"` for `"High"` | `"H"`       |
| `configurations`  | Record<String, QRCodeConfiguration> | An object containing keyed custom configurations for specific QR Codes.                                                                                         | `{}`        |

### QR Code Configuration

To configure a specific QR Code properties you can either set data attributes for an HTML element (see [HTML Element Configuration](#html-element-configuration) section) or use the `configurations` option (see [QR Codes Static Configuration](#qr-codes-static-configuration) section). 

#### HTML Element Configuration

You can customize each QR Code by applying to a specific HTML element the following data attributes

| Name                    | Default                                                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `data-text`             | QR Code content to be rendered, if not set the plugin will use the `href` attribute value (if available) as content. |
| `data-size`             | see `size` in [Global Configuration](#global-configuration)                                                          |
| `data-color-dark`       | see `colorDark` in [Global Configuration](#global-configuration)                                                     |
| `data-color-light`      | see `colorLight` in [Global Configuration](#global-configuration)                                                    |
| `data-correction-level` | see `correctionLevel` in [Global Configuration](#global-configuration)                                               |


> [!TIP]
> The generated QR Code will contain the value of the `data-text` data attribute or fallback to the `href` attribute one.


#### QR Codes Static Configuration

You can customize each QR Code by defining a configuration in the `configurations` option in [Global Configuration](#global-configuration) and adding an ID to a specific HTML element.

Available `QRCodeConfiguration` parameters are as follow:

| Name              | Default                                                                                                              |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| `text`            | QR Code content to be rendered, if not set the plugin will use the `href` attribute value (if available) as content. |
| `size`            | see `size` in [Global Configuration](#global-configuration)                                                          |
| `colorDark`       | see `colorDark` in [Global Configuration](#global-configuration)                                                     |
| `colorLight`      | see `colorLight` in [Global Configuration](#global-configuration)                                                    |
| `correctionLevel` | see `correctionLevel` in [Global Configuration](#global-configuration)                                               |


> [!IMPORTANT]
> Parameters specified in the `configurations` object will take precedence over HTML element data attributes

##### Example

Specify a QR Code configuration

```js
// ...
plugins: [ /* ... */ ],
qrcodes: {
    selector: ".qrcode",
    configurations: {
        "example-qr-code": {
            text: "https://example.com/",
            size: 512,
            correctionLevel: 1
        }
    }
}
```

and set an element ID

```html
<p id="example-qr-code" class="qrcode"></p>
```


## Tips

### QR Code size

Since [Reveal.js](https://revealjs.com/) will add constraints to `max-width` and `max-height` through CSS for `img`, we suggest adding the following class to revert this behaviour for QR Code images

```css
.qrcode img {
  max-width: 100%;
  max-height: 100%;
}
```

> [!NOTE]
> Change `.qrcode` selector with the class you chose as `selector` in [Global Configuration](#global-configuration)


## License

MIT

---

Made with ✨ & ❤️ by [ForWarD Software](https://github.com/forwardsoftware) and [contributors](https://github.com/forwardsoftware/revealjs-plugins/graphs/contributors)
