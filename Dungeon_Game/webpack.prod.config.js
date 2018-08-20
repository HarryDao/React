const path = require('path');
const Webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, './dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.less$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {loader: 'less-loader'},        
                ]
            },
            {
                test: /\.(png|jp(e*)g|gif)$/,
                use: [
                    {loader: 'file-loader'}
                ]
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            template: 'public/index.html'
        }),
        new CleanWebpackPlugin('./dist'),
        new UglifyJsPlugin({
            sourceMap: false,
        }),
        new Webpack.LoaderOptionsPlugin({
            minimize: true,
        }),   
    ],
}
