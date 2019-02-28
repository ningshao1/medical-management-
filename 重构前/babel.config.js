module.exports = {
    presets: [
        ['@babel/preset-env', {
            modules: false,
            useBuiltIns: 'entry'
        }]
    ],
    plugins: ['@babel/plugin-syntax-dynamic-import', 'babel-plugin-transform-vue-jsx']
};