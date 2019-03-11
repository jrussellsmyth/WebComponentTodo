const gulp = require('gulp');
const file = require('gulp-file');
const rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const alias = require('rollup-plugin-alias');
const globals = require('rollup-plugin-node-globals')


const createBundle = (target) => {
  return rollup.rollup({
    input: target.entry,
    treeshake: false,
    external: [],
    plugins: [
      nodeResolve({
        // old way to import modules
        jsnext: true,
        // node/commonjs module loading
        main: true,
        // ES6 module loading
        module: true
      }), globals()
      //, alias(target.alias)
    ]
  }).then(bundle => {
    return bundle.generate({
      format: 'es',
      name: 'library',
      sourcemap: true
    });
  }).then(gen => {
    return file(target.module, gen.code, { src: true }).pipe(gulp.dest('dist/'))
  });
};

gulp.task('bundle', () => {
  createBundle({ entry: 'es/redux-app.js', module: 'app-redux.js' })
});
