const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./index.ts",
  resolve: {
    extensions: [".js", ".json", ".ts", ".tsx"]
  },
  target: "node",
  optimization: {
    // We no not want to minimize our code.
    minimize: false
  },
  mode: "production",
  devtool: "inline-source-map",
  performance: {
    // Turn off size warnings for entry points
    hints: false
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  }
};
