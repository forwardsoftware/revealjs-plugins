import QRCode from "qrcodets";

const DEFAULT_CONFIGURATION = {
  selector: ".qrcode",
  size: 256,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctionLevel: 2,
};

const Plugin = () => {
  return {
    id: "qrcodes",

    init: function (deck) {
      const deckConfig = deck.getConfig();
      const config = Object.assign({}, DEFAULT_CONFIGURATION, deckConfig.qrcodes);

      console.info("🔳 QR Codes plugin by ForWarD Software loaded", config);

      function renderQRCodes() {
        document.querySelectorAll(config.selector).forEach(function (el) {
          console.info("🔳 %s found", el.tagName, el);

          new QRCode({
            element: el,
            text: el.dataset.text || el.href,
            width: el.dataset.size || config.size,
            height: el.dataset.size || config.size,
            colorDark: el.dataset.colorDark || config.colorDark,
            colorLight: el.dataset.colorLight || config.colorLight,
            correctLevel: el.dataset.correctionLevel || config.correctionLevel,
          });
        });
      }

      window.addEventListener("DOMContentLoaded", renderQRCodes);
    },
  };
};

export default Plugin;
