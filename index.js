let reroute;
require("colors")
const i18next = require("i18next");
const i18n_backend = require("i18next-node-fs-backend");

const backendOptions = {
  loadPath: "./locales/{{lng}}/{{ns}}.json",
  jsonIndent: 2,
};

const i18n_node = {
  getT: function getT() {
    return reroute;
  },
  setT: function setT(t) {
    reroute = t;
  },

  rand: function rand(string, params) {
    const loc = reroute;
    const options = loc(string, { returnObjects: true, ...params }, params);
    const ran = Math.floor(Math.random() * (options.length));

    return options[ran];
  },
};


const translateEngineStart = () => {
  readdirAsync( "./locales" ).then((list) => {
    i18next.use(i18n_backend).init(
      {
        backend: backendOptions,
        lng: "en",
        fallbackLng: ["en", "dev"],
        fallbackToDefaultNS: true,
        fallbackOnNull: true,
        returnEmptyString: false,
        preload: list,
        load: "currentOnly",
        ns: [
          "bot_strings",
          "events",
          "commands",
          "website",
          "items",
          "translation",
          "games",
        ],
        defaultNS: "bot_strings",
        fallbackNS: "translation",
        interpolation: {
          escapeValue: false,
        },
      },
      (err, t) => {
        if (err) {
          console.warn(
            "•".yellow,
            "Failed to Load Some Translations".yellow,
            `\n${err.map((e) => e?.path?.gray).join("\n")}`
          );
        }
        console.log("• ".green, "Translation Engine Loaded");

        i18n_node.setT(t);
        global.i18n = i18next;
        global.$t = i18n_node.getT();
        global.rand$t = i18n_node.rand;
      }
    );
  });
  return "Translation Engine Loading!";
};

module.exports = {translateEngineStart,i18n_node};