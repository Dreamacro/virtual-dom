module.exports = config => {
    config.set({
        browsers: ['ChromeHeadless'],

        frameworks: ['jasmine'],

        files: [
            './src/**/*.ts',
            './test/**/*.tsx'
        ],

        preprocessors: {
            './src/**/*.ts': ['webpack', 'sourcemap'],            
            './test/**/*.tsx': ['webpack', 'sourcemap'],
        },

        reporters: ['spec'],

        webpack: {
            resolve: {
                extensions: ['.webpack.js', '.ts']
            },
            module: {
                rules: [
                    { test: /\.tsx?$/, loader: 'awesome-typescript-loader', options: { silent: true } },
                ]
            }
        },

        webpackMiddleware: {
            noInfo: true
        },
    })
}