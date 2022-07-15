const { build } = require('esbuild')
const path = require('path')


const shared = {
  entryPoints: [path.relative(__dirname, 'src', 'index.js')],
  bundle: true,
  minify: true,
  tsconfig: path.resolve(__dirname, 'tsconfig.json'),
  external: ['mobx'],
}

build({
  ...shared,
  format: 'esm',
  outfile: path.resolve(__dirname, 'lib', 'index.esm.js'),
})

build({
  ...shared,
  format: 'cjs',
  outfile: path.resolve(__dirname, 'lib', 'index.cjs.js'),
})
