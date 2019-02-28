const path = require("path"),
    merge = require("webpack-merge"),
    CleanWebpackPlugin = require("clean-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    webpackBaseConfig = require("./webpack.base.config");
module.exports = merge(webpackBaseConfig, {
    output: {
        path: path.resolve("./dist/static/"),
        publicPath: "/static/",
        filename: "[name].[chunkhash:6].js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "../index.html",
            template: "./config/template.html"
        }),
        new CleanWebpackPlugin([path.resolve("./dist")], {
            allowExternal: true
        })
    ]
});
