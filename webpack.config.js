module.exports = {
    entry: {
        vd: './src/index.ts',
        example: './example/vd.tsx'
    },
    output: {
        filename: './dist/[name].js',
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.webpack.js', '.ts']
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
        ]
    }
}
