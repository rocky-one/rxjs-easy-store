const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HappyPack = require('happypack');
const os = require('os');

const config = {
    entry: {
        index: path.join(__dirname, '../src/index.js'),
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '../dist'),
        // publicPath: '',
        library: 'rx-store',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.js','.jsx'],
    },
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             common: {
    //                 chunks: 'initial',
    //                 minChunks: 2,
    //                 minSize: 0,
    //             }
    //         }
    //     }
    // },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'happypack/loader?id=js',
                exclude: /node_modules/,
            }
        ]
    },
    plugins: [
        // new CleanWebpackPlugin({
        //     cleanOnceBeforeBuildPatterns:[
        //         'dist/*.*',
        //     ]
        // }),
        // new webpack.DllReferencePlugin({
        //     manifest: require('./manifest.json'),
        //     context: path.resolve(__dirname, '../'),
        // }),
       
        new HappyPack({
            id: 'js',
            //HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多
            threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
            verbose: true,
            loaders: ['babel-loader']
        }),

    ]
}

module.exports = config;
