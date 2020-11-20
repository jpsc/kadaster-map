const path = require('path');

module.exports = {
    mode: 'development',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/'),
    },
    entry: {
        index: path.resolve(__dirname, './index.js'),
    },
 }