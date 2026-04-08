import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

const extensions = [".js", ".ts"];

function createPlugins({ declaration = false } = {}) {
  return [
    resolve({
      extensions,
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration,
      declarationDir: declaration ? "dist/types" : undefined,
    }),
    babel({
      babelHelpers: "bundled",
      extensions,
      presets: [
        [
          "@babel/preset-env",
          {
            targets: "> 0.25%, not dead",
          },
        ],
      ],
    }),
  ];
}

export default [
  {
    input: {
      index: "src/index.ts",
      core: "src/core.ts",
    },
    output: [
      {
        dir: "dist",
        format: "es",
        sourcemap: true,
        entryFileNames: "[name].js",
      },
      {
        dir: "dist",
        format: "cjs",
        exports: "named",
        sourcemap: true,
        entryFileNames: "[name].cjs",
      },
    ],
    external: ["vue"],
    plugins: createPlugins({ declaration: true }),
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.umd.js",
      format: "umd",
      name: "AliyunCaptchaVue",
      exports: "named",
      globals: {
        vue: "Vue",
      },
      sourcemap: true,
    },
    external: ["vue"],
    plugins: createPlugins(),
  },
];
