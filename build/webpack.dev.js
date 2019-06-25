const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HappyPack = require('happypack');
const os = require('os');
const glob = require('glob');
const PurifyCss = require('purifycss-webpack');

const config = {
    entry: {
        app: path.join(__dirname, '../src/App.jsx'),
        //app2: path.join(__dirname, '../src/App2.jsx'),
        //'path/of/entry': './app.js',
        //entry: ['./app.js', 'lodash']
    },
    output: {
        filename: '[name].[hash:8].js',
        path: path.join(__dirname, '../dist'),
        publicPath: ''
    },
    resolve: {
        extensions: ['.js', '.jsx', '.less', '.css'],
        alias: {
            jquery: path.resolve(__dirname,'../src/lib/jquery-2.1.1.min.js')
        }
    },
    optimization: {
        // minimizer: [ // 会覆盖默认项 new UglifyJsPlugin({})需要自行设置

        // ],
        splitChunks: {
            cacheGroups: {
                common: {
                    chunks: 'initial',
                    minChunks: 2,
                    minSize: 0,
                }
            }
        }
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            publicPath: '../', // 设置路径否则错误
                            name: 'images/[name].[hash:7].[ext]' //相对于dist根目录
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    'happypack/loader?id=css'
                ],
                // exclude: /node_modules/
            },
            // 此loader 为了打包antd 必须设置include否则无效
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    { loader: 'css-loader' }
                ],
                include: /node_modules/
            },
            // {
            //     test: /\.css$/,
            //     use: [
            //         {
            //             loader: MiniCssExtractPlugin.loader,
            //         },
            //         {
            //             loader: "css-loader",
            //             options: {
            //                 modules:true,
            //                 localIdentName:'[local]-[hash:base64:6]'
            //             }
            //         },
            //         {
            //             loader: "postcss-loader",
            //             options: {
            //                 plugins: [
            //                     require("autoprefixer")
            //                 ]
            //             }
            //         }
            //     ]
            // },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: '[local]-[hash:base64:6]'
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
                use: 'happypack/loader?id=js',
                exclude: /node_modules/,
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin([
            'dist/*.*',
            'dist/js/*.*',
            'dist/style',
            'dist/images'
        ], {
                root: path.join(__dirname, '../') //必须配置root 否则无效
            }),
        new webpack.DllReferencePlugin({
            manifest: require('./manifest.json'),
            context: path.resolve(__dirname, '../'),
        }),
        new MiniCssExtractPlugin({
            filename: 'style/[name].[hash:8].css',
            // chunkFilename: "[name].css"
        }),
        // 或者是在rules 中使用imports-loader
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new HappyPack({
            id: 'css',
            //HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多
            threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
            threads: 2, // 开启几个子进程处理
            verbose: true,
            loaders: [
                {
                    loader: "css-loader",
                    options: {
                        modules: true,
                        localIdentName: '[local]-[hash:base64:6]',
                        // allchunk:
                    }
                },
                {
                    loader: "postcss-loader",
                    options: {
                        indent: 'postcss',
                        plugins: (loader) => [ //必须返回函数 否则报错 null
                            require('autoprefixer')()
                        ],
                    }
                }
            ]
        }),
        new HappyPack({
            id: 'js',
            //HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多
            threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
            verbose: true,
            loaders: ['babel-loader']
        }),

        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                parser: require('postcss-safe-parser'), // 修正语法错误
                discardComments: { removeAll: true },
                //safe: true, // 避免重新计算 z-index
            },
            autoprefixer: false,
            //autoprefixer: { disable: true },  // 如果有前缀被移除的情况 添加此配置试试
            canPrint: true
        }),

        new HtmlWebpackPlugin({
            title: '123',
            filename: 'index.html',
            template: path.join(__dirname, '../src/index.html'),
            favicon: path.join(__dirname, '../src/img/favicon.ico')
        }),
        // new HtmlWebpackPlugin({
        //     filename: 'index2.html',
        //     template: path.join(__dirname,'../src/index2.html')
        // }),
        // 去除冗余css 无效 待解决
        // new PurifyCss({ 
        //     paths: glob.sync([
        //         path.join(__dirname, './*.html'),
        //         path.join(__dirname, './src/*.js') 
        //     ])
        // })
    ]
}

module.exports = config;