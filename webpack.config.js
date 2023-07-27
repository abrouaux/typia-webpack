/* eslint-disable @typescript-eslint/naming-convention */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { execSync } = require("child_process");
// webpack.config.ts
const { InspectorWebpackPlugin } = require("@modern-js/inspector-webpack-plugin");

function createWebpackConfig(env, argv) {
  const production = argv.mode === "production";
  const { PORT } = process.env;
  const webpackConfig = {
    cache: {
      type: "filesystem",
    },
    ignoreWarnings: [
      // necessary to prevent runtime errors in some packages
      /only default export is available soon/,
    ],
    // Documentation: https://webpack.js.org/configuration/mode/
    mode: production ? "production" : "development",
    // needed to output code compatible for old browsers
    target: ["web", "es5"],
    resolve: {
      // fallback: { util: require.resolve("util/") },
      extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".json"],
    },
    entry: {
      app: path.join(__dirname, "src", "main.ts"),
    },
    output: {
      path: path.join(__dirname, "dist"),
      filename: "scripts/[name]_[contenthash:5].js",
      clean: true,
    },
    optimization: {
      // minimize: true, // adding this shows many more
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "commons",
            chunks: "all",
          },
        },
      },
      // runtimeChunk: "single",
    },
    module: {
      rules: [
        // For TypeScript files
        {
          test: /\.(ts|tsx)$/,
          exclude: [/node_modules/],
          loader: "swc-loader",
          options: {
            // This makes swc-loader invoke swc synchronously.
            // sync: true,
            module: {
              type: 'commonjs',
            },
            env: {
              // debug: true,
              dynamicImport: false,
            },
            jsc: {
              target: "es5",
              externalHelpers: true,
              parser: {
                  syntax: "typescript"
              }
            }
          }
        },
        // For TypeScript typia model files
        {
          test: /typia\.(ts|tsx)$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: path.join(__dirname, "./tsconfig.typia.json"),
                // transpileOnly: false,
              },
            },
    
          ],
        },
      ],
    },
    performance: {
      // This specifies the bundle size limit that will trigger Webpack's warning saying:
      // "The following entrypoint(s) combined asset size exceeds the recommended limit."
      maxEntrypointSize: 250000,
      maxAssetSize: 250000,
    },
    devServer: {
      port: PORT,
    },
    devtool: production ? undefined : "source-map",
    plugins: [
      new HtmlWebpackPlugin({
        template: "assets/index.html",
      }),
    ],
  };

  if (process.env.WEBPACK_INSPECTOR) {
    webpackConfig.plugins.push(new InspectorWebpackPlugin());
    execSync("open http://localhost:3333");
  }

  return webpackConfig;
}

module.exports = createWebpackConfig;
