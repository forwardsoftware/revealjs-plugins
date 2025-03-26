import QRCode from "qrcodets";

const DEFAULT_CONFIGURATION = {
  selector: ".qrcode",
  size: 256,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctionLevel: 2,
  configurations: {},
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
          console.info("🔳 QR Code found as '%s' element:", el.tagName, el);

          let elementConfiguration = {
            text: el.dataset.text || el.href,
            size: el.dataset.size || config.size,
            colorDark: el.dataset.colorDark || config.colorDark,
            colorLight: el.dataset.colorLight || config.colorLight,
            correctionLevel: el.dataset.correctionLevel || config.correctionLevel,
          };

          if (config.configurations[el.id]) {
            elementConfiguration = {
              ...elementConfiguration,
              ...config.configurations[el.id],
            };
          }

          console.debug("🔳 QR Code generating using configuration:", elementConfiguration);

          new QRCode({
            element: el,
            text: elementConfiguration.text,
            width: elementConfiguration.size,
            height: elementConfiguration.size,
            colorDark: elementConfiguration.colorDark,
            colorLight: elementConfiguration.colorLight,
            correctLevel: elementConfiguration.correctionLevel,
          });
        });
      }

      window.addEventListener("DOMContentLoaded", renderQRCodes);
    },
  };
};

export default Plugin;
