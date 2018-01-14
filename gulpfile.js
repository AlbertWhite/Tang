var gulp = require("gulp");
var browserSync = require("browser-sync");
var reload = browserSync.reload;

gulp.task("server", function() {
  browserSync({
    server: {
      //create server
      baseDir: "." //set the dir for index.html
    }
  });
  gulp.watch("*.html", reload); //watch for changes in html and reload
  gulp.watch("*.js", reload); //watch for changes in html and reload
  gulp.watch("*.css", reload); //watch for changes in html and reload
});
