import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import strip from "@rollup/plugin-strip";
import terser from "@rollup/plugin-terser";
import gulp from "gulp";
import { rimraf } from "rimraf";
import { rollup } from "rollup";

const babelConfig = {
  babelHelpers: "bundled",
  ignore: ["node_modules"],
  compact: false,
  extensions: [".js"],
  presets: [
    [
      "@babel/preset-env",
      {
        corejs: 3,
        useBuiltIns: "usage",
        modules: false,
        targets: {
          browsers: [
            "last 2 Chrome versions",
            "last 2 Safari versions",
            "last 2 iOS versions",
            "last 2 Firefox versions",
            "last 2 Edge versions",
          ],
        },
      },
    ],
  ],
  ignore: [/node_modules\/(?!(highlight\.js|marked)\/).*/],
};

const debugRollupPlugins = [resolve(), commonjs(), babel(babelConfig), terser()];

const prodRollupPlugins = [resolve(), commonjs(), strip(), babel(babelConfig), terser()];

async function compile(variant) {
  const rollupPlugins = variant === "debug" ? debugRollupPlugins : prodRollupPlugins;
  const rollupOutputName = variant !== "prod" ? `plugin.${variant}.js` : `plugin.js`;
  const rollupOutputFormat = variant === "esm" ? "es" : "umd";

  const builder = await rollup({
    input: `./src/plugin.js`,
    plugins: rollupPlugins,
  });

  await builder.write({
    file: `./dist/${rollupOutputName}`,
    name: "RevealCaffeine",
    format: rollupOutputFormat,
  });
}

// Creates a UMD and ES module bundle for each plugin
export async function plugins() {
  await Promise.all(["debug", "esm", "prod"].map(compile));
}

// npm run clean / npx gulp clean: clean 'dist' folder
export const clean = () => rimraf("./dist/");

// npm run build / npx gulp build: build plugins
export const build = gulp.series(clean, plugins);

// watch files for changes and trigger rebuild tasks
async function watchFiles() {
  gulp.watch("src/**/*.js", plugins);
}

// npm run watch / npx gulp watch: continuously update index.html from deps
export const watch = gulp.series(build, watchFiles);

export default build;
