// @ts-check

/**
 * @typedef {import('./base.js').BuildProfile} BuildProfile
 * @typedef {import('./base.js').modules} modules
 * @typedef {import('./base.js').resolve} resolve
 * @typedef {import('./base.js').plugins} plugins
 */

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @type modules
 */
const modules = (
  profile,
) => {
  const { basePath, nodeModulesPath, tsconfigPath, sassIncludePaths, srcPath } = profile;

  return {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: [
          {
            loader: 'source-map-loader',
            options: {
              /**
               * @param {string} _url
               * @param {string} resourcePath
               */
              filterSourceMappingUrl: (_url, resourcePath) => {
                if (/tsee\//i.test(resourcePath)) {
                  return false;
                }

                return true;
              },
            },
          },
        ],
      },
      {
        test: /\.m?js$/,
        include: /node_modules/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: path.resolve(__dirname, './node_modules/'),
        oneOf: [
          {
            resourceQuery: /lit/,
            use: [
              { loader: 'lit-scss-loader', options: { minify: false } },
              { loader: path.resolve(__dirname, './loaders/escape-lit-scss.js') },
              {
                loader: 'extract-loader',
                options: {
                  publicPath: '',
                  sourceMap: true,
                },
              },
              {
                loader: 'css-loader',
                options: { sourceMap: true, esModule: false },
              },
              {
                loader: 'sass-loader',
                options: {
                  api: 'modern-compiler',
                  sassOptions: {
                    quietDeps: true,
                    includePaths: sassIncludePaths
                      ? sassIncludePaths
                      : [ basePath, srcPath, nodeModulesPath ],
                  },
                  sourceMap: true,
                },
              },
            ],
          },
          {
            use: [
              { loader: MiniCssExtractPlugin.loader }, // options: { publicPath: '/' } },
              { loader: 'css-loader', options: { sourceMap: true } },
              { loader: 'resolve-url-loader', options: { sourceMap: true } },
              {
                loader: 'sass-loader',
                options: {
                  api: 'modern-compiler',
                  sassOptions: {
                    quietDeps: true,
                    includePaths: sassIncludePaths
                      ? sassIncludePaths
                      : [ basePath, srcPath, nodeModulesPath ],
                  },
                  sourceMap: true,
                },
              },
            ],
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|woff|woff2)/,
        exclude: path.resolve(__dirname, './node_modules/'),
        dependency: { not: [ 'url' ] },
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              alias: {},
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(ttf|eot|svg|otf)/,
        exclude: path.resolve(__dirname, './node_modules/'),
        dependency: { not: [ 'url' ] },
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: path.resolve(__dirname, './node_modules/'),
        oneOf: [
          {
            resourceQuery: /worker/,
            use: [
              {
                loader: 'worker-loader',
                options: {
                  inline: 'fallback',
                },
              },
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        corejs: '3.36.0',
                        useBuiltIns: 'entry',
                      },
                    ],
                  ],
                  plugins: [
                    [
                      'template-html-minifier',
                      {
                        modules: {
                          lit: [ 'html' ],
                        },
                        strictCSS: true,
                        htmlMinifier: {
                          collapseWhitespace: true,
                          conservativeCollapse: true,
                          removeComments: true,
                          caseSensitive: true,
                          minifyCSS: true,
                        },
                      },
                    ],
                  ],
                },
              },
              {
                loader: 'ts-loader',
                options: {
                  configFile: path.resolve(__dirname, './tsconfig.worker.json'),
                },
              },
            ],
          },
          {
            test: /\.tsx?$/,
            exclude: path.resolve(__dirname, './node_modules/'),
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        corejs: '3.36.0',
                        useBuiltIns: 'entry',
                      },
                    ],
                  ],
                },
              },
              {
                loader: 'ts-loader',
                options: {
                  configFile: tsconfigPath ?? path.join(basePath, 'tsconfig.json'),
                },
              },
            ],
          },
        ],
      },
      {
        test: /\.m?jsx?$/,
        exclude: path.resolve(__dirname, './node_modules/'),
        oneOf: [
          {
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        corejs: '3.36.0',
                        useBuiltIns: 'entry',
                      },
                    ],
                  ],
                  plugins: [
                    '@babel/plugin-transform-class-properties',
                  ],
                },
              },
            ],
          },
          {
            use: [
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        corejs: '3.36.0',
                        useBuiltIns: 'entry',
                      },
                    ],
                  ],
                  plugins: [
                    '@babel/plugin-transform-class-properties',
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        test: /\.hbs$/,
        exclude: path.resolve(__dirname, './node_modules/'),
        use: [
          {
            loader: 'handlebars-loader',
            options: {
              minimize: profile.mode === 'production',
              extensions: [ 'handlebars', 'hbs', '' ],
              helperDirs: [
                path.resolve(__dirname, '../html/helpers/'),
              ],
            },
          },
        ],
      },
      {
        test: /\.mp3$/,
        exclude: path.resolve(__dirname, './node_modules/'),
        loader: 'file-loader',
      },
      {
        test: /\.pug$/,
        exclude: path.resolve(__dirname, './node_modules/'),
        include: srcPath,
        loader: 'pug-loader',
      },
      {
        resourceQuery: /inline/,
        exclude: path.resolve(__dirname, './node_modules/'),
        type: 'asset/inline',
      },
    ],
  };
};

/**
 * @type plugins
 */
const plugins = (
  profile,
  plugins,
) => ([
  new webpack.ProvidePlugin({
    process: 'process/browser',
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: profile.mode === 'production',
  }),
  ...plugins,
]);

/**
 * @type resolve
 */
const resolve = (
  profile,
) => {
  const { nodeModulesPath, resolveModules = [], srcPath } = profile;

  return {
    symlinks: false,
    modules: [
      ...resolveModules,
      srcPath,
      nodeModulesPath,
    ],
    fallback: {},
    extensions: [ '.js', '.jsx', '.ts', '.tsx', '.mjs' ],
  };
};

export {
  modules,
  plugins,
  resolve,
};
