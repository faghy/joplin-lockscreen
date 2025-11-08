const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const tar = require('tar');
const fs = require('fs-extra');

const distDir = path.resolve(__dirname, 'dist');
const srcDir = path.resolve(__dirname, 'src');

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    target: 'node',

    output: {
        path: distDir,
        filename: 'index.js',
        libraryTarget: 'commonjs2',
    },

    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            'api': path.resolve(__dirname, 'api'),
        },
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true
                    }
                },
                exclude: /node_modules/,
            },
        ],
    },

    externals: {
        'crypto': 'commonjs crypto',
        'electron': 'commonjs2 electron',
    },

    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(srcDir, 'manifest.json'),
                    to: path.resolve(distDir, 'manifest.json'),
                },
            ],
        }),
        // Plugin custom per creare il file .jpl
        {
            apply: (compiler) => {
                compiler.hooks.afterEmit.tapAsync('CreateJplArchive', async (compilation, callback) => {
                    try {
                        const manifest = await fs.readJson(path.join(distDir, 'manifest.json'));
                        const pluginFilename = `${manifest.id}.jpl`;

                        console.log(`\n📦 Creating plugin archive: ${pluginFilename}`);

                        await tar.create(
                            {
                                gzip: true,
                                file: path.join(distDir, pluginFilename),
                                cwd: distDir,
                            },
                            ['manifest.json', 'index.js']
                        );

                        console.log(`✅ Plugin created successfully: dist/${pluginFilename}\n`);
                        callback();
                    } catch (error) {
                        console.error('❌ Error creating .jpl file:', error);
                        callback(error);
                    }
                });
            },
        },
    ],

    optimization: {
        minimize: false
    },

    stats: {
        colors: true,
    },
};