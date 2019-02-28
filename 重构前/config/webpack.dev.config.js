const merge = require("webpack-merge"),
    webpack = require("webpack"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    webpackBaseConfig = require("./webpack.base.config");

module.exports = merge(webpackBaseConfig, {
    devtool: "eval-source-map",
    output: {
        publicPath: "/",
        filename: "[name].js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./config/template.html"
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        hot: true,
        open: true,
        host: "0.0.0.0",
        //自动打开浏览器时，不会打开0.0.0.0，而是网卡所绑定的ip
        useLocalIp: true,
        //当编译错误时把信息在浏览器用一层遮罩显示
        overlay: true,

        port: process.env.RUN_ENV==="java"?2605:8888,

        //精简webpack在控制台的输出
        stats: "minimal"
    }
});
