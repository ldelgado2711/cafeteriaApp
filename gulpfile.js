const { src, dest, watch, series, parallel } = require('gulp');

// CSS Y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps'); // para saber scss original para el CSS
const cssnano = require('cssnano'); // CSS Minifier

// Imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

function css(done) {
    // compilar sass
    // pasos: 1- identificar archivo. 2- Compilarla. 3- Guardar el .css

    src('src/scss/app.scss') // 1- identificar archivo.
        .pipe(sourcemaps.init())
        .pipe(sass({ /*outputStyle: 'compressed'*/ })) // 2- Compilarla.
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css')); // 3- Guardar el .css

    done();
}

function imagenes() {
    return src('src/img/**/*')
        .pipe(imagemin({ optimizationLevel: 3 }))
        .pipe(dest('build/img'));
}

function versionWebp() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'));
}

function versionAvif() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'));
}

function dev() {
    watch('src/scss/**/*.scss', css);
    watch('src/img/**/*', imagenes);
}

exports.css = css;
exports.imagenes = imagenes;
exports.dev = dev;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
/* tareas por default */
exports.imagenes = imagenes;
exports.default = series(imagenes, versionWebp, versionAvif, css, dev); /* en la linea de terminal se corre solo "gulp" cuando se usan series y/o parallel. !Dejar la de watch al final */