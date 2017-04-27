const webpack = require('webpack')
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        vd: './src/index.ts',
        example: './example/vd.ts'
    },
    output: {
        filename: './dist/[name].js',
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',
    resolve: {
        extensions: ['.webpack.js', '.ts']
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: 'awesome-typescript-loader' },
            { test: /\.js$/, enforce: 'pre', loader: 'source-map-loader' }
        ]
    }
}
