module.exports = {
    plugins: [
        require('autoprefixer')({browsers: ['last 10 version', '> 1%']})
        // require('cssnano')
    ]
};