const path = require("path");
const { DefinePlugin } = require("webpack");
const port = process.env.prot;
const webpackDeepScopePlugin = require('webpack-deep-scope-plugin').default
module.exports = {
    configureWebpack: config => {
        return {
            resolve: {
                alias: {
                    //别名
                    "@": path.resolve(__dirname, "./src"),
                    "@el": path.resolve(__dirname, "./src/element-ui"),
                    "@u": path.resolve(__dirname, "./src/utils"),
                    "@c": path.resolve(__dirname, "./src/components")
                }
            },
            plugins: [
                new DefinePlugin({
                    APP_ENV: JSON.stringify(process.env.APP_ENV),
                    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                }),
                // new webpackDeepScopePlugin()
            ]
        };
    },

    css: {
        sourceMap: true
    },
    devServer: {
        hot: true,
        open: true,
        host: "0.0.0.0",
        //自动打开浏览器时，不会打开0.0.0.0，而是网卡所绑定的ip
        useLocalIp: true,
        //当编译错误时把信息在浏览器用一层遮罩显示
        overlay: true,
        port,
        //精简webpack在控制台的输出
        stats: "minimal"
    }
};