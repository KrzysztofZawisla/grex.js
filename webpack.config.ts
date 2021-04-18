/* eslint-disable @typescript-eslint/triple-slash-reference */
///<reference path="webpack.d.ts" />

import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import {
  Configuration,
  WebpackPluginInstance,
  optimize,
  RuleSetRule,
} from "webpack";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import DuplicatePackageCheckerPlugin from "duplicate-package-checker-webpack-plugin";
import nodeExternals from "webpack-node-externals";
import WasmPackPlugin from "@wasm-tool/wasm-pack-plugin";

type TypeTarget = "umd" | "module" | "commonjs" | "amd" | "system";

const { AggressiveMergingPlugin } = optimize;

const getEntryPoint = (
  isWASM: boolean,
  isTargetedToBrowser: boolean,
): string => {
  const folder: string = isWASM ? "wasm" : "native";
  const wasmFolder = isWASM ? (isTargetedToBrowser ? "browser" : "node") : "";
  return path.join(__dirname, "src", folder, wasmFolder, "index.ts");
};

const setupConfig = (
  _environment: unknown,
  { mode }: { mode: string },
): Configuration[] => {
  let isFirstWASMBrowserCompile = true;
  let isFirstWASMNodeCompile = true;
  const getConfig = (
    typeTarget: TypeTarget,
    isWASM: boolean = false,
    isTargetedToBrowser: boolean = false,
  ): Configuration => {
    const entryPoint: string = getEntryPoint(isWASM, isTargetedToBrowser);
    const babelTarget: string = isTargetedToBrowser
      ? "last 2 Chrome versions, last 2 Firefox versions"
      : "current";
    const wasmPluginInstance = new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, "src", "wasm", "native"),
      outDir: path.join(
        __dirname,
        "src",
        "wasm",
        "native",
        `pkg-${isTargetedToBrowser ? "browser" : "node"}`,
      ),
      extraArgs: "--no-typescript",
    });
    const config: Configuration = {
      mode: mode === "development" ? mode : "production",
      entry: entryPoint,
      target: isTargetedToBrowser ? "web" : "node",
      optimization: {
        minimize: mode !== "development",
        minimizer: [
          (new TerserPlugin({
            extractComments: true,
            terserOptions: {
              module: typeTarget === "module",
            },
          }) as unknown) as WebpackPluginInstance,
        ],
        usedExports: true,
      },
      devtool: "source-map",
      module: {
        rules: [
          {
            test: /\.(js)$/,
            enforce: "pre",
            use: ["source-map-loader"],
          },
          {
            test: /\.(ts|tsx)$/,
            include: path.join(__dirname, "src"),
            exclude: [/(node_modules|bower_components)/, /\.test\.(ts|tsx)$/],
            use: [
              {
                loader: "babel-loader",
                options: {
                  presets: [
                    [
                      "@babel/env",
                      {
                        targets: isTargetedToBrowser
                          ? babelTarget
                          : {
                              node: babelTarget,
                            },
                        bugfixes: true,
                        useBuiltIns: "usage",
                        corejs: "3",
                      },
                    ],
                    "@babel/preset-typescript",
                  ],
                  plugins: [
                    "@babel/plugin-syntax-top-level-await",
                    "const-enum",
                  ],
                },
              },
              /*{
                loader: "@stavalfi/babel-plugin-module-resolver-loader",
                options: {
                  root: [path.join(__dirname, "src")],
                  extensions: [".js", ".d.ts", ".ts"],
                },
              },*/
            ],
          },
          !isWASM && {
            test: /\.node$/,
            use: [
              {
                loader: "node-loader",
                options: {
                  name: "index.node",
                },
              },
            ],
          },
          isWASM && {
            test: /\.wasm$/,
            type: "webassembly/sync",
          },
          /*isWASM && {
            test: /\.wasm$/,
            //type: "webassembly/async",
            use: ["wasm-loader"],
          },*/
          /*isWASM && {
            test: /\.rs$/,
            type: "webassembly/async",
            use: {
              loader: "rust-native-wasm-loader",
              options: {
                release: true,
                cargoWeb: true,
                wasmBindgen: {
                  wasm2es6js: true,
                },
              },
            },
          },*/
        ].filter(Boolean) as (RuleSetRule | "...")[],
      },
      output: {
        path: path.join(
          __dirname,
          "lib",
          !isWASM ? "native" : "wasm",
          isWASM ? (isTargetedToBrowser ? "browser" : "node") : "",
        ),
        library: typeTarget !== "module" ? "grex.js" : undefined,
        libraryTarget: typeTarget,
        libraryExport: "default",
        filename: `index${typeTarget === "umd" ? "" : `-${typeTarget}`}.js`,
        chunkFilename: `[id]-${typeTarget}.js`,
      },
      externals: isTargetedToBrowser ? undefined : [nodeExternals()],
      resolve: {
        extensions: [".js", ".ts", ".json", ".node", ".wasm"],
      },
      experiments: {
        topLevelAwait: true,
        outputModule: typeTarget === "module" ? true : false,
        syncWebAssembly: true,
      },
      plugins: ([
        new DuplicatePackageCheckerPlugin(),
        new CleanWebpackPlugin({
          dry: true,
          dangerouslyAllowCleanPatternsOutsideProject: true,
        }),
        /*new RemovePlugin({
          after: {
            include: [
              path.join(
                __dirname,
                "src",
                isWASM ? "native-addon" : "wasm",
                indexDTS,
              ),
            ],
          },
        }),*/
        mode !== "development" &&
          new BundleAnalyzerPlugin({
            openAnalyzer: false,
            analyzerMode: "static",
            reportFilename: `../../${
              isWASM ? "../" : ""
            }analyzer-reports/analyzer-${isWASM ? "wasm-" : "native"}${
              isTargetedToBrowser ? "browser" : "node"
            }-${typeTarget}-report.html`,
          }),
        isWASM &&
          isFirstWASMNodeCompile &&
          !isTargetedToBrowser &&
          wasmPluginInstance,
        isWASM &&
          isFirstWASMBrowserCompile &&
          isTargetedToBrowser &&
          wasmPluginInstance,
        /*new CopyPlugin({
          patterns: [
            {
              from: path.join(
                __dirname,
                "src",
                isWASM ? "wasm" : "native-addon",
                isWASM ? (isTargetedToBrowser ? "browser" : "node") : "",
                indexDTS,
              ),
              to: path.join(
                __dirname,
                "lib",
                isWASM ? "wasm" : "native",
                isWASM ? (isTargetedToBrowser ? "browser" : "node") : "",
                indexDTS,
              ),
              noErrorOnMissing: false,
            },
          ],
          options: {
            concurrency: 100,
          },
        }),*/
        new ESLintPlugin({
          extensions: ["ts", "tsx"],
        }),
        new CaseSensitivePathsPlugin(),
        new AggressiveMergingPlugin(),
      ].filter(Boolean) as unknown) as WebpackPluginInstance[],
    };
    if (isWASM) {
      if (isFirstWASMBrowserCompile && isTargetedToBrowser) {
        isFirstWASMBrowserCompile = false;
      }
      if (isFirstWASMNodeCompile && !isTargetedToBrowser) {
        isFirstWASMNodeCompile = false;
      }
    }
    return config;
  };
  return [
    getConfig("umd"),
    getConfig("amd"),
    getConfig("commonjs"),
    getConfig("system"),
    getConfig("module"),

    getConfig("umd", true),
    getConfig("amd", true),
    getConfig("commonjs", true),
    getConfig("system", true),
    getConfig("module", true),

    getConfig("umd", true, true),
    getConfig("amd", true, true),
    getConfig("commonjs", true, true),
    getConfig("system", true, true),
    getConfig("module", true, true),
  ];
};

export default setupConfig;
