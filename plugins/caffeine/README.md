# ☕️ Caffeine

> Custom plugin for [Reveal.js](https://revealjs.com/) to avoid screen going to sleep during active presentations

## How To

Simply include `RevealCaffeine` plugin and it will automatically activate on presentation start if [`Screen Wake Lock API`](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API) is supported by the browser.

```js
Reveal.initialize({
  // ...
  plugins: [
    // ...,
    RevealCaffeine,
  ],
});
```

> [!IMPORTANT]  
> The Wake Lock will be released when the presentation is paused or the tab is hidden.

## Configuration

You can configure the plugin with the following options:

```js
// ...
plugins: [ /* ... */ ],
caffeine: {

}
```

## License

MIT

---

Made with ✨ & ❤️ by [ForWarD Software](https://github.com/forwardsoftware) and [contributors](https://github.com/forwardsoftware/revealjs-plugins/graphs/contributors)