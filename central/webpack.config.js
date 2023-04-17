const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    resolve: {
        fallback: {
            "fs": false,
            "tls": false,
            "net": false,
            "path": false,
            "zlib": false,
            "http": false,
            "https": false,
            "stream": false,
            "crypto": false,
            // "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify
        }
    },
    entry: {
        main: './src/js/main.js',
    },
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: './public',
        },
        port: 8081,
        // hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
            template: "./src/index.html"
        }),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public'),
        clean: true,
        publicPath: '/',
    },
};