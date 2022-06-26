const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const { resolve } = require("path");

module.exports = {
  entry: { mane: "./src/index.js" },
  output: {
    path: resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
    environment: {
      arrowFunction: false,
    },
    assetModuleFilename: "images/[name][ext]",
  },
  devtool:
    process.env.NODE_ENV === "development" ? "eval-source-map" : "source-map",
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),
    new BrowserSyncPlugin(
      {
        host: "localhost",
        port: 3001,
        proxy: "http://localhost:9001/",
      },
      {
        reload: false,
      }
    ),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  //target: "web",
  devServer: {
    compress: true,
    port: 9001,
    watchFiles: ["*.html"],
  },
};
