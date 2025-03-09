const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        pacifico: ["Pacifico", ...fontFamily.sans],
      },
    },
  },
};
