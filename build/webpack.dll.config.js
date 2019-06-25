const webpack = require('webpack');
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const env = process.env.NODE_ENV === 'development'; 
module.exports = {
    entry: {
        bundle: ['react','react-dom','react-router-dom'],
    },
    output: {
        filename: '[name].[hash:8].js',
        path: path.join(__dirname,'../dist/js/bundle'),
        library: '[name]',       // 暴露到全局 否则undefined
        publicPath: env ? '/dist/js/bundle' : 'js/bundle', 
    },
    mode: 'development',
    plugins:[
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns:[
                'dist/js/bundle/*.*',
            ]
        },{
            root: path.join(__dirname,'../') //必须配置root 否则无效
        }),
        new webpack.DllPlugin({
            path: path.join(__dirname,'../build/manifest.json'),
            context: path.resolve(__dirname,'../'),
            name: '[name]',
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname,'../src/temaplate/index.html'),
            filename: path.join(__dirname,'../src/index.html'),
            
        }),
    ]
}