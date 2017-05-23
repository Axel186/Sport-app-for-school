'use strict';


const webpack = require('webpack');
const path = require('path');

const config = require(path.join(__dirname, './config/default'));
const sourcePath = path.resolve(__dirname, './client');
const staticsPath = path.resolve(__dirname, './public');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const nodeEnv = (!config.isDev) ? 'production' : 'development';
const isProd = (!config.isDev);

var webpackModule = {
  devtool: 'source-map',
  context: sourcePath,
  entry: {
    js: './app.js',
    vendor: [
      "angular",
      "@angular/router/angular1/angular_1_router",
      "angular-sanitize",
      "moment",
      // "@angular/router",
      // "eustia-module"
    ]
  },
  output: {
    filename: (!isProd) ? 'app.js' : "[name].[hash].js",
    path: staticsPath,
    // publicPath: '/assets',
    pathinfo: true,
  },
  module: {
    rules: [{
      test: /\.html$/,
      exclude: /node_modules/,
      use: {
        loader: 'html-loader',
      }
    }, {
      test: /\.pug$/,
      use: {
        loader: 'pug-ng-html-loader',
      }
    }, {
      test: /\.styl$/,
      loader: 'style-loader!css-loader!stylus-loader',
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader',
    }],
  },
  resolve: {
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      sourcePath
    ]
  },

  devServer: {
    contentBase: './client',
    historyApiFallback: true,
    port: config.devPort,
    compress: isProd,
    inline: !isProd,
    hot: !isProd,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true,
      colors: {
        green: '\u001b[32m',
      }
    },
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: (!isProd) ? "vendor.js" : "[name].[hash].js"
    }),
    new HtmlWebpackPlugin({
      title: "test title",
      template: path.resolve(__dirname, "client/index.html")
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      Tether: 'tether'
    })
    // new webpack.EnvironmentPlugin({
    //     NODE_ENV: nodeEnv,
    // }),
    // new webpack.NamedModulesPlugin(),
  ],
};

if (isProd) {
  webpackModule.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false,
      },
    })
  );
} else {
  webpackModule.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
}

module.exports = webpackModule;
