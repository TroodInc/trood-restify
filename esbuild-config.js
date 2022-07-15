const ESBuild = require('esbuild')
const path = require('path')


ESBuild.build({
  outdir: path.resolve(__dirname, 'lib'),
  entryPoints: [path.relative(__dirname, 'src', 'index.js')],
  bundle: true,
  minify: true,
  tsconfig: path.resolve(__dirname, 'tsconfig.json'),
  external: ['mobx'],
})
