const path = require("path"),
    webpack = require("webpack"),
    VueLoaderPlugin = require("vue-loader/lib/plugin"),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    {
        happyPackPlugins,
        getHappyLoader
    } = require("./happypack-plugins"),
    environment = process.env.NODE_ENV,
    isProduction = environment === "production",
    isDevelopment = environment === "development";
    const currentDate=new Date();
const plugins = [
    ...happyPackPlugins,
    new webpack.DefinePlugin({
        KLD_VERSION: JSON.stringify(
            `V1.${currentDate.getFullYear()-2018}.${currentDate.getMonth() + 1}.${currentDate.getDate()}.${currentDate.getHours()}`
        ),
        RUN_ENV: JSON.stringify(process.env.RUN_ENV),
        isTestPro: process.env.RUN_ENV === "test_out",
        
    }),
    new VueLoaderPlugin()
];

if (isProduction) {
    plugins.push(
        new MiniCssExtractPlugin({
            filename: "[name].[chunkhash:6].css"
        })
    );
}

const genCacheGroup = name => {
    const priority = genCacheGroup.currentPriority = (genCacheGroup.currentPriority || 0) + 1;
    return {
        // name,
        test: new RegExp(`(?<!node_modules.*)([/\\\\])src\\1${name}`),
        minSize: 0,
        minChunks: 2,
        priority,
        reuseExistingChunk: true,
    };
};

module.exports = {
    mode: environment,
    entry: {
        main: "./src/main.js"
    },
    optimization: {
        runtimeChunk: {
            name: "manifest"
        },
        splitChunks: {
            chunks: "all",
            maxAsyncRequests: Infinity,
            cacheGroups: {
                common: genCacheGroup('common'),
                components: genCacheGroup('components'),
                utils: genCacheGroup('utils'),
                mixins: genCacheGroup('mixins')
            }
        }
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve('./src/components'),
                    path.resolve('./src/utils'),
                    path.resolve('./src/mixins'),
                ],
                sideEffects: false
            },
            {
                test: /\.js$/,
                use: getHappyLoader("js"),
                exclude: /node_modules/
            },

            {
                test: /([\/\\])node_modules\1.*\1?iview\1src\1.*\.js$/,
                use: getHappyLoader("js")
            },

            {
                test: /\.vue$/,
                use: [
                    "vue-loader",
                    {
                        loader: "iview-loader",
                        options: {
                            prefix: true
                        }
                    }
                ]
            },

            {
                test: /\.(?:css|less)$/,
                use: [
                    isProduction ?
                    MiniCssExtractPlugin.loader : {
                        loader: "vue-style-loader",
                        options: {
                            sourceMap: isDevelopment
                        }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            minimize: isProduction,
                            sourceMap: isDevelopment
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: isDevelopment
                        }
                    }
                ],

                oneOf: [{
                    test: /\.less$/,
                    use: {
                        loader: "less-loader",
                        options: {
                            sourceMap: isDevelopment
                        }
                    }
                }]
            },

            {
                test: /\.(?:gif|jpg|png|woff|svg|eot|ttf)(?:\?.*)?$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 3000,
                        name: "[hash:6].[ext]"
                    }
                }
            }
        ]
    },

    resolve: {
        extensions: [".js", ".vue", ".json"],
        alias: {
            "@": path.resolve("./src"),
            //全局common
            "@common": path.resolve("./src/common"),
            //巡检任务common
            "@inspection-common": path.resolve(
                "./src/views/QualityControl/InspectionTasks/common"
            ),
            //图片库
            "@image": path.resolve("./src/views/image"),
            "@img": path.resolve("./src/img")
        }
    },
    plugins,
    externals: {
        jquery: "jQuery"
    }
};