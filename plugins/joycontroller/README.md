# 🎮 JoyController

> Custom plugin for [Reveal.js](https://revealjs.com/) to control presentations using Nintendo Switch Joy-Cons

## Key bindings

By default, the plugin is configured with the following key bindings:

| Left    | Right | Action         |
| ------- | ----- | -------------- |
| `RIGHT` | `A`   | Right          |
| `DOWN`  | `B`   | Down           |
| `UP`    | `X`   | Up             |
| `LEFT`  | `Y`   | Left           |
| `SR`    | `SR`  | Next slide     |
| `SL`    | `SL`  | Previous slide |
| `-`     | `+`   | Toggle pause   |

## Configuration

You can configure the plugin with the following options:

```js
// ...
plugins: [ /* ... */ ],
joycon: {
    type: 'right',   // or 'left', depending on the Joy Con you want to use, default is 'right'
    cooldown: 200,   // the time in ms between two actions, default is 300
    pointerSpeed: 10 // the speed of the pointer, default is 20
}
```

## Credits

Inspired by [Firnael/reveal.js-joycon-plugin](https://github.com/Firnael/reveal.js-joycon-plugin)

## License

MIT

---

Made with ✨ & ❤️ by [ForWarD Software](https://github.com/forwardsoftware) and [contributors](https://github.com/forwardsoftware/revealjs-plugins/graphs/contributors)
