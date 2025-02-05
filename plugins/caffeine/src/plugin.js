const DEFAULT_CONFIGURATION = {};

const Plugin = () => {
  let wakeLockSentinel = null;

  async function acquireWakeLock(evt) {
    console.debug("☕️ Screen Wake Lock acquiring on", evt.type, "event");

    try {
      // release existing lock (if any)
      if (wakeLockSentinel !== null) {
        releaseWakeLock(evt);
      }

      // acquire screen wake lock
      wakeLockSentinel = await navigator.wakeLock.request("screen");
      console.info("☕️ Screen Wake Lock acquired");
    } catch (err) {
      console.error("☕️ Screen Wake Lock API acquire error:", err.name, err.message);
    }
  }

  async function releaseWakeLock(evt) {
    console.debug("☕️ Screen Wake Lock releasing on", evt.type, "event");
    if (wakeLockSentinel === null) {
      console.warn("☕️ Screen Wake Lock not yet acquired");
      return;
    }

    try {
      await wakeLockSentinel.release();
      wakeLockSentinel = null;

      console.info("☕️ Screen Wake Lock released");
    } catch (err) {
      console.error("☕️ Screen Wake Lock API release error:", err.name, err.message);
    }
  }

  async function handleVisibilityChanged(evt) {
    console.info("☕️ Tab visibility changed to", document.visibilityState);

    // release/acquire wakelock on tab visibility change
    switch (document.visibilityState) {
      case "hidden":
        return releaseWakeLock(evt);

      case "visible":
        return acquireWakeLock(evt);
    }
  }

  return {
    id: "caffeine",

    init: function (deck) {
      const deckConfig = deck.getConfig();
      const config = Object.assign({}, DEFAULT_CONFIGURATION, deckConfig.caffeine);

      console.info("☕️ Caffeine plugin by ForWarD Software loaded", config);

      if (!navigator.wakeLock) {
        console.warn("☕️ Screen Wake Lock API NOT supported!");
        return;
      }

      console.info("☕️ Screen Wake Lock API supported... attaching event listeners");

      deck.on("paused", releaseWakeLock);
      deck.on("resumed", acquireWakeLock);

      deck.on("ready", acquireWakeLock);

      document.addEventListener("visibilitychange", handleVisibilityChanged);
    },

    destroy: function () {
      document.removeEventListener("visibilitychange", handleVisibilityChanged);

      releaseWakeLock({ type: "destroy" });
    },
  };
};

export default Plugin;
