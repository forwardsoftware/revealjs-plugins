const DEFAULT_CONFIGURATION = {
  type: "right",
  cooldown: 300,
  pointerSpeed: 20,
};

const RIGHT_JOYCON_BUTTON = {
  A: 0,
  X: 1,
  B: 2,
  Y: 3,
  SL: 4,
  SR: 5,
  ZR: 7,
  R: 8,
  PLUS: 9,
  STICK: 10,
  HOME: 16,
};

const LEFT_JOYCON_BUTTON = {
  DLEFT: 0,
  DBOTTOM: 1,
  DUP: 2,
  DRIGHT: 3,
  SL: 4,
  SR: 5,
  ZL: 6,
  L: 8,
  MINUS: 9,
  STICK: 10,
  SCREENSHOT: 16,
};

const ACTIONS = {
  left: {
    RIGHT: LEFT_JOYCON_BUTTON.DRIGHT,
    LEFT: LEFT_JOYCON_BUTTON.DLEFT,
    UP: LEFT_JOYCON_BUTTON.DUP,
    DOWN: LEFT_JOYCON_BUTTON.DBOTTOM,
    PREV: LEFT_JOYCON_BUTTON.SL,
    NEXT: LEFT_JOYCON_BUTTON.SR,
    QUIT_OVERVIEW_OR_NEXT: LEFT_JOYCON_BUTTON.ZL,
    TOGGLE_OVERVIEW: LEFT_JOYCON_BUTTON.L,
    TOGGLE_POINTING: LEFT_JOYCON_BUTTON.STICK,
    TOGGLE_PAUSE: LEFT_JOYCON_BUTTON.MINUS,
    TOGGLE_HELP: LEFT_JOYCON_BUTTON.SCREENSHOT,
  },
  right: {
    RIGHT: RIGHT_JOYCON_BUTTON.A,
    LEFT: RIGHT_JOYCON_BUTTON.Y,
    UP: RIGHT_JOYCON_BUTTON.X,
    DOWN: RIGHT_JOYCON_BUTTON.B,
    PREV: RIGHT_JOYCON_BUTTON.SL,
    NEXT: RIGHT_JOYCON_BUTTON.SR,
    QUIT_OVERVIEW_OR_NEXT: RIGHT_JOYCON_BUTTON.ZR,
    TOGGLE_OVERVIEW: RIGHT_JOYCON_BUTTON.R,
    TOGGLE_POINTING: RIGHT_JOYCON_BUTTON.STICK,
    TOGGLE_PAUSE: RIGHT_JOYCON_BUTTON.PLUS,
    TOGGLE_HELP: RIGHT_JOYCON_BUTTON.HOME,
  },
};

const Plugin = () => {
  return {
    id: "joycontroller",

    init: function (deck) {
      const deckConfig = deck.getConfig();
      const config = Object.assign({}, DEFAULT_CONFIGURATION, deckConfig.joycon);

      console.info("🎮 JoyController plugin by ForWarD Software loaded", config);

      const haveEvents = "GamepadEvent" in window;
      const haveWebkitEvents = "WebKitGamepadEvent" in window;
      const rAF = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.requestAnimationFrame;

      const controllers = {};

      const buttonsStateCache = {};
      function isButtonInCooldown(id) {
        if (!buttonsStateCache[id]) {
          buttonsStateCache[id] = Date.now();
          return false;
        }

        if (Date.now() - buttonsStateCache[id] >= config.cooldown) {
          buttonsStateCache[id] = Date.now();
          return false;
        }

        return true;
      }

      function handleGamepadButtonPressed(gamepad, buttonIdx) {
        if (isButtonInCooldown(`${gamepad.id}-btn-${buttonIdx}`)) {
          return;
        }

        console.debug("🎮 %s => Button %d pressed", gamepad.id, buttonIdx);
        const actionsMap = ACTIONS[config.type];

        switch (buttonIdx) {
          case actionsMap.RIGHT:
            deck.right();
            break;
          case actionsMap.DOWN:
            deck.down();
            break;
          case actionsMap.UP:
            deck.up();
            break;
          case actionsMap.LEFT:
            deck.left();
            break;
          case actionsMap.PREV:
            deck.prev();
            break;
          case actionsMap.NEXT:
            deck.next();
            break;
          case actionsMap.TOGGLE_OVERVIEW:
            deck.toggleOverview();
            break;
          case actionsMap.QUIT_OVERVIEW_OR_NEXT:
            if (deck.isOverview()) {
              deck.toggleOverview();
            } else {
              deck.next();
            }
            break;
          case actionsMap.TOGGLE_PAUSE:
            deck.togglePause();
            break;
          case actionsMap.TOGGLE_POINTING:
            pointing = !pointing;
            pointer.style.display = pointing ? "block" : "none";
            break;
          case actionsMap.TOGGLE_HELP:
            deck.toggleHelp();
            break;
          default:
            console.warn("🎮 %s => Button %d not mapped", gamepad.id, buttonIdx);
        }
      }

      function getGamepads() {
        return navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : [];
      }

      function checkControllersStatus() {
        const gamepads = getGamepads(); // Gamepads should be retrieved each time, otherwise it won't work on Safari/Chrome
        if (!gamepads) {
          return;
        }

        for (const gamepadIndex in gamepads) {
          const gamepad = gamepads[gamepadIndex];
          if (!gamepad) {
            continue;
          }

          for (let buttonIndex = 0; buttonIndex < gamepad.buttons.length; ++buttonIndex) {
            const gamepadButton = gamepad.buttons[buttonIndex];

            let pressed = gamepadButton === 1.0;
            let touched = false;

            if (typeof gamepadButton === "object") {
              pressed = gamepadButton.pressed;
              if ("touched" in gamepadButton) {
                touched = gamepadButton.touched;
              }
            }

            if (pressed || touched) {
              handleGamepadButtonPressed(gamepad, buttonIndex);
            }
          }
        }

        rAF(checkControllersStatus);
      }

      function registerGamepad(gamepad) {
        controllers[gamepad.index] = gamepad;

        rAF(checkControllersStatus);
      }

      function deregisterGamepad(gamepad) {
        delete controllers[gamepad.index];
      }

      function gamepadConnectedHandler(evt) {
        console.info("🎮 %s connected ⚡", evt.gamepad.id, evt.gamepad);
        registerGamepad(evt.gamepad);
      }

      function gamepadDisconnectedHandler(evt) {
        deregisterGamepad(evt.gamepad);
        console.info(`🎮 ${evt.gamepad.id} disconnected 🔌`, evt.gamepad);
      }

      function scanGamepads() {
        console.debug("🎮 scanning Gamepads list");

        const gamepads = getGamepads();

        for (const gamepadIndex in gamepads) {
          const gamepad = gamepads[gamepadIndex];
          if (!gamepad) {
            continue;
          }

          if (gamepad.index in controllers) {
            controllers[gamepad.index] = gamepad;
          } else {
            registerGamepad(gamepad);
          }
        }

        console.debug(`🎮 found ${controllers.length} Gamepads`, controllers);
      }

      if (haveEvents) {
        window.addEventListener("gamepadconnected", gamepadConnectedHandler);
        window.addEventListener("gamepaddisconnected", gamepadDisconnectedHandler);

        console.debug("🎮 Standard Mode: Listening for standard Gamepad events");
      } else if (haveWebkitEvents) {
        window.addEventListener("webkitgamepadconnected", gamepadConnectedHandler);
        window.addEventListener("webkitgamepaddisconnected", gamepadDisconnectedHandler);

        console.debug("🎮 WebKit Mode: Listening for WebKit Gamepad events");
      } else {
        setInterval(scanGamepads, 500);

        console.debug("🎮 Legacy Mode: Polling Gamepad status");
      }
    },
  };
};

export default Plugin;
