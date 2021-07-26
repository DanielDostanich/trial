const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const setup = {
    splitChunks: {
      chunks: 'all',
    }
  }

  if (isProd) {
    setup.minimizer = [
      new TerserPlugin(),
      new CSSMinimizerPlugin()
    ]
  }

  return setup;
}

const fileName = extension => isDev ? `[name].${extension}` : `[name].[contenthash].${extension}`;

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    main: './index.tsx',

  },
  optimization: optimization(),
  devtool: isDev ? 'source-map' : undefined,
  output: {
    filename: fileName('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: [".tsx", ".json", ".js"],
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: isProd,
    }),
    new CleanWebpackPlugin(),
    new MiniCSSExtractPlugin({
      filename: fileName('css')
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCSSExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(s([as])ss)$/,
        use: [{
          loader: MiniCSSExtractPlugin.loader
        }, {
          loader: 'css-loader'
        }, {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: function () {
                return [
                  require('autoprefixer')
                ];
              }
            }
          }
        }, {
          loader: 'sass-loader'
        }]
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.ttf$/,
        use: ['file-loader']
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      }
    ]
  }
}