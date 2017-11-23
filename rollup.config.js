import babel from 'rollup-plugin-babel'
import builtins from 'rollup-plugin-node-builtins'
import commonjs from 'rollup-plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import json from 'rollup-plugin-json'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'

const env = process.env.NODE_ENV
const version = process.env.npm_package_version
const name = process.env.npm_package_name

const config = {
  name,
  sourcemap: true,
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
      VERSION: `'${version}'`,
    }),
    builtins(),
    resolve(),
    commonjs({
      ignoreGlobal: true,
      exclude: ['packages/**'],
    }),
    json(),
    babel({
      include: ['packages/**'],
      runtimeHelpers: true,
    }),
    filesize(),
  ],
}

export default config
