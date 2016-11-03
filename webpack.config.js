module.exports = {
    entry: {
        index: './index.js'
    },
    output: {
        path: './dist',
        filename: 'index.min.js',
        library: 'Drawer',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015'],
                    plugins: ['add-module-exports']
                }
            }
        ]
    }
};
