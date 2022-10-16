const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@mui/styled-engine": "@mui/styled-engine-sc",
    },
  },
};
