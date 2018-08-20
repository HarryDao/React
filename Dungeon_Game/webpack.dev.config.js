const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

const port = process.env.PORT || 8080;

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, './dist'),
        publicPath: '/'
    },
    devtool: 'inline-source-map',
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
        })
    ],
    devServer: {
        host: 'localhost',
        port: port,
        historyApiFallback: true
    }
}