const path    = require('path')

const JS_INCLUDES = path.join(__dirname, "src")


module.exports = {
  entry: {
    "skyway-siru-client": "./src/index"
  },
  devtool: "source-map",
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: '/dist/',
    filename: process.env.NODE_ENV === "production" ? "[name].min.js" : "[name].js",
    library: 'SiRuClient',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test : /\.js$/,
        include: JS_INCLUDES,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'flow'],
            },
          }
        ],
      },
      { test: /\.json$/, loader: 'json' }
    ],
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  plugins: [
  ],
  node: {
  },
  devServer: {
    contentBase: path.join(__dirname, "examples"),
    compress: true,
    inline: true,
    port: 9000
  }
}

// npm --save-dev install babel-core babel-loader babel-polyfill babel-preset-es2015 babel-preset-react jest json-loader nock react react-dom webpack
//
