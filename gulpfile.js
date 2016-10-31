var gulp = require("gulp");
var sass = require("gulp-sass");
var Mark = require("markup-js");
var fs = require("fs");
var csv = require("fast-csv");
var del = require("del");
var copy = require("gulp-copy");

var processData = require("./in/processData.js").processData;
 
var rawData = [];
var data;
var template;

gulp.task('readTemplates', function()
{
    template = fs.readFileSync("in/template.html","utf8");
});

gulp.task('readData', function(done){
    rawData = [];
    if (!fs.existsSync("in/data.csv"))
    {
        console.error("ERROR: You need to provide the file 'in/data.csv'");
        done();
        return;
    }
    
    var text = fs.readFileSync("in/data.csv","utf8");
    csv.fromString(text, {headers: true})
        .on("data", function(row)
        {
            rawData.push(row);
        })
        .on("end", function()
        {
            done();
        });
});

gulp.task('processData', ['readData'], function(){
    data = processData(rawData);
})

gulp.task('renderIndex', ['readTemplates', 'readData', 'processData','sass'], function(){
    var result = Mark.up(template, data)
    fs.writeFileSync('out/index.html', result);
});

gulp.task('sass', function() {
  return gulp.src('in/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass())
    .pipe(gulp.dest('out'))
});

gulp.task('clearLibs', function()
{
    return del(['out/ext/**/*'])
});

gulp.task('copyLibs', ['clearLibs'], function(){
    return gulp.src("node_modules/font-awesome/**/*")
        .pipe(copy("out/ext", {prefix:1}));
});

gulp.task('update', ['sass', 'renderIndex', 'copyLibs']);

gulp.task('watch', ['update'], function()
{
    return gulp.watch('in/**/*.*', ['update'])
});

gulp.task('default', ['watch']);

