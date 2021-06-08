var gulp = require( 'gulp' ),
    sass = require( 'gulp-sass' ),
    csso = require( 'gulp-csso' ),
    del = require( 'del' ),
    colors = require( 'ansi-colors' ),
    imagemin = require( 'gulp-imagemin' ),
    autoprefixer = require( 'gulp-autoprefixer' );

// Filenames of source and distribution folders
var source_folder = 'src',
    distribution_folder = 'dist';

// File paths to images, CSS, and fonts
var css_path = './' + source_folder + '/scss/',
    images_path = './' + source_folder + '/img/',
    fonts_path = './' + source_folder + '/fonts/',
    language_path = './' + source_folder + '/lang/';

// Task to clean out the distribution folder, run before rebuilding files
gulp.task( 'clean',
    function() {
        return clean( distribution_folder );
    }
);
gulp.task( 'clean' ).description = "Remove old files from the distribution folder";

// Task to build all files for distribution
gulp.task( 'dist',
    gulp.series(
        'clean',
        css,
        images,
        fonts,
        language
    )
);
gulp.task( 'dist' ).description = "Build all files for distribution to the FitPay web app";

gulp.task( 'default',
    gulp.series(
        'dist',
        watch
    )
);
gulp.task( 'default' ).description = "Build all files for distribution, watch for changes";

// Remove all files from the specified folder
function clean( folder ) {
    if( folder == distribution_folder ) {
        console.log( colors.red( 'Cleaning the ' + folder + ' folder...' ) );
        return del([
            './' + distribution_folder + '/**/*'
            // Negate the pattern to ignore files (add a comma above)
            //'!build/js/jquery.js.min'
        ]);
    } else if( folder == 'images' ) {
        console.log( colors.red( 'Cleaning the ' + folder + ' folder...' ) );
        return del([
            './' + distribution_folder + '/img/**/*'
        ]);
    } else if( folder == 'css' ) {
        console.log( colors.red( 'Cleaning the ' + folder + ' folder...' ) );
        return del([
            './' + distribution_folder + '/css/**/*'
        ]);
    } else if( folder == 'fonts' ) {
        console.log( colors.red( 'Cleaning the ' + folder + ' folder...' ) );
        return del([
            './' + distribution_folder + '/fonts/**/*'
        ]);
    } else if( folder == 'language' ) {
        console.log( colors.red( 'Cleaning the ' + folder + ' folder...' ) );
        return del([
            './' + distribution_folder + '/lang/**/*'
        ]);
    } else {
        console.log( colors.red( 'Cannot clean the ' + folder + ' folder, permission denied.' ) );
        // Need to figure out how to signal that the task is done in this case...
    }
}

// Compile the Sass files, autoprefix, and run the CSS through an optimizer
function css() {
    return gulp.src( './' + source_folder + '/scss/style.scss', { allowEmpty: true } )
        // Compile Sass files
        .pipe( sass( { precision: 10 } ).on( 'error', sass.logError ) )
        // Auto-prefix CSS for cross-browser compatibility
        .pipe( autoprefixer() )
        // Optimize and minify the resulting CSS
        // .pipe( csso() )
        // Output to the distribution folder
        .pipe( gulp.dest( './' + distribution_folder + '/css/' ) );
}

// Prepare images for distribution
function images() {
    return gulp.src( './' + source_folder + '/img/**/*', { allowEmpty: true } )
        // Minify PNG, JPG, GIF, and SVG files
        .pipe( imagemin() )
        // Output to the distribution folder
        .pipe( gulp.dest( './' + distribution_folder + '/img/' ) );
}

// Prepare fonts for distribution
function fonts() {
    return gulp.src( './' + source_folder + '/fonts/**/*', { allowEmpty: true } )
        // Output to the distribution folder
        .pipe( gulp.dest( './' + distribution_folder + '/fonts/' ) );
}

// Prepare language files for distribution
function language() {
    return gulp.src( './' + source_folder + '/lang/**/*', { allowEmpty: true } )
        // Output to the distribution folder
        .pipe( gulp.dest( './' + distribution_folder + '/lang/' ) );
}

// Watch for file changes and refresh as needed
function watch() {
    console.log( colors.green( 'Watching for file changes...' ) );
    // Watch for CSS changes
    gulp.watch( css_path + '**/*', function(cb) {
        clean( 'css' );
        console.log( colors.green( 'Rebuilding CSS...' ) );
        css();
        cb();
    } );
    // Watch for image changes
    gulp.watch( images_path + '**/*', function(cb) {
        clean( 'images' );
        console.log( colors.green( 'Rebuilding images...' ) );
        images();
        cb();
    } );
    // Watch for font changes
    gulp.watch( fonts_path + '**/*', function(cb) {
        clean( 'fonts' );
        console.log( colors.green( 'Rebuilding fonts...' ) );
        fonts();
        cb();
    } );
    // Watch for language changes
    gulp.watch( language_path + '**/*', function(cb) {
        clean( 'language' );
        console.log( colors.green( 'Rebuilding language files...' ) );
        language();
        cb();
    } );
}
