const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const NODE_ENV = process.env.NODE_ENV;
const IS_DEV = NODE_ENV === "development";
const IS_PROD = NODE_ENV === "production";
const GLOBAL_CSS_REGEXP = /\.global\.css$/;

const DIST_DIR = path.resolve(__dirname, "dist");

function setupDevtool() {
  if (IS_DEV) return "eval";
  if (IS_PROD) return false;
};

module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    alias: {
      'cornerstone-wado-image-loader':
        'cornerstone-wado-image-loader/dist/dynamic-import/cornerstoneWADOImageLoader.min.js',
    },
  },
  mode: NODE_ENV || "development",
  entry: path.resolve(__dirname, "src/index.jsx"),
  output: {
    path: DIST_DIR,
    filename: "index.js",
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        //exclude: /node_modules/,
        include: {
          and: [/node_modules/],
          not: [/core-js/]
        },
        use: {

          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-react", "@babel/preset-typescript", ['@babel/preset-env', { /*targets: "defaults", */modules: false }]],
            plugins: ["@babel/plugin-transform-modules-commonjs", "add-module-exports", "@babel/plugin-transform-object-rest-spread",/* [
              "@babel/plugin-transform-runtime",
              {
                "corejs": false,
                "helpers": true,
                "regenerator": true,
                "useESModules": true
              }
            ]*/],
            sourceType: "unambiguous",
          }
        }
      },
      {
        test: /\.[tj]sx?$/,
        use: ["ts-loader"],
        //exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                mode: "local",
                localIdentName: "[name]__[local]--[hash:base64:5]",
              },
            },
          },
        ],
        exclude: GLOBAL_CSS_REGEXP
      },
      {
        test: GLOBAL_CSS_REGEXP,
        use: ['style-loader', 'css-loader']
      }
    ],
  },
  devtool: setupDevtool(),

  plugins: [
    new HtmlWebpackPlugin({template: path.resolve(__dirname, 'index.html')}),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './node_modules/cornerstone-wado-image-loader/dist/dynamic-import',
          to: DIST_DIR,
        },
      ],
    }),
  ],

  devServer: {
    port: 3000,
    //open: true,
    hot: IS_DEV,
    historyApiFallback: true,
  }
};
