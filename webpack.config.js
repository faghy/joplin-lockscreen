const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  target: 'node',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },

  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'api': path.resolve(__dirname, 'api')
    }
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true  // Ignora errori tipo per velocizzare
          }
        },
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: 'src/manifest.json',
          to: 'manifest.json'
        }
      ]
    })
  ],

  externals: {
    'crypto': 'commonjs crypto'
  },

  optimization: {
    minimize: false
  }
};
