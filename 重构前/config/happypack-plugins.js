const HappyPack = require('happypack');
    // threadPool = HappyPack.ThreadPool({size: 8}),
    // isProduction = process.env.NODE_ENV === 'production',
    // isDevelopment = process.env.NODE_ENV === 'development'


exports.happyPackPlugins = [
    new HappyPack({
        id: 'js',
        // threadPool,
        threads: 4,
        loaders: [
            {
                loader: 'babel-loader',
                options: {cacheDirectory: true}
            }
        ]
    })

    // new HappyPack({
    //     id: 'css',
    //     threadPool,
    //     loaders: [
    //         {
    //             loader: 'css-loader',
    //             options: {
    //                 minimize: isProduction,
    //                 sourceMap: isDevelopment
    //             }
    //         },
    //         {
    //             loader: 'postcss-loader',
    //             options: {sourceMap: isDevelopment}
    //         }
    //     ]
    // }),
    //
    // new HappyPack({
    //     id: 'less',
    //     threadPool,
    //     loaders: [
    //         {
    //             loader: 'css-loader',
    //             options: {
    //                 minimize: isProduction,
    //                 sourceMap: isDevelopment
    //             }
    //         },
    //         {
    //             loader: 'postcss-loader',
    //             options: {sourceMap: isDevelopment}
    //         },
    //         {
    //             loader: 'less-loader',
    //             options: {sourceMap: isDevelopment}
    //         }
    //     ]
    // }),
    //
    // new HappyPack({
    //     id: 'file',
    //     threadPool,
    //     loaders: [
    //         {
    //             loader: 'url-loader',
    //             options: {
    //                 limit: 3000,
    //                 name: '[hash:6].[ext]'
    //             }
    //         }
    //     ]
    // })
];

exports.getHappyLoader = id => ({
    loader: 'happypack/loader',
    options: {id}
});