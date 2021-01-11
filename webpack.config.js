const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    output: {
        filename: '[name].js',
    },
    entry: {
        index: path.resolve(__dirname, './index.js'),
    },
    plugins: [
        new HtmlWebpackPlugin({
          template: 'index.ejs',
        }),
        new Dotenv(),
        new CopyWebpackPlugin(
            {
                patterns: [
                    {
                        from: './*.png',
                    }
                ]
            }   
        ), 
      ]
 }