var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    devtool: 'source-map',
    output: { path: path.resolve('dist'), filename: 'js/bundle.js' },
    module: {
    loaders: [
            {
                test: /.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query:  {
                            presets: ['env']
                        }
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: {loader: 'html-loader'} 
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract('css-loader')
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract('css-loader!sass-loader')
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
        title: 'web-rcp-2.0',
        template: 'res/index.html',
        inject: 'body'

        }),

        new ExtractTextPlugin('res/style.css', {
            allChunks: true
        }),

        new MinifyPlugin({}, {})
    
    ]
};

