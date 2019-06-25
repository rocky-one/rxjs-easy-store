const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const config = {
    entry: {
        app: path.join(__dirname, '../src/App.jsx')
    },
    output: {
        filename: '[name].[hash:8].js',
        path: path.join(__dirname, '../dist'),
        chunkFilename: '[name].[hash:8].js',
        publicPath: '/dist/',
    },
    mode: 'development',
    resolve: {
        extensions: ['.js', '.jsx', '.less'],
        alias: {
            jquery: path.resolve(__dirname,'../src/lib/jquery-2.1.1.min.js')
        }
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[hash:7].[ext]'
                        }
                    }
                ]
            },
            // {
            //     test: /\.(html)$/,
            //     use: {
            //         loader: 'html-loader',
            //         options: {
            //             attrs: ['img:src','img:data-src']
            //           }
            //     }
            // },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                        // options: {
                        //     modules:true,
                        //     localIdentName:'[local]-[hash:base64:6]'
                        // }
                    },
                    
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [
                                require("autoprefixer")
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ],
                include: /node_modules/
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules:true,
                            localIdentName:'[local]-[hash:base64:6]'
                        }
                    },
                    {
                        loader: "less-loader"
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [
                                require("autoprefixer")
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
            },
            
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'app',
            filename: 'index.html',
            template: path.join(__dirname, '../src/index.html')
        }),
        new webpack.DllReferencePlugin({
            manifest: require('./manifest.json'),
            context: path.resolve(__dirname,'../'),
        }),
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),

    ],
    devServer: {
        port: 8088,
        hot: true,
        open: true,
        publicPath: '/dist/',
        openPage: 'dist/index.html', // 指定打开那个页面
    }
}

module.exports = config;