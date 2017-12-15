var gulp = require('gulp');
var concat = require('gulp-concat');
var order = require("gulp-order");
var uglify = require("gulp-uglify");
var ngAnnotate = require('gulp-ng-annotate')
var sass = require('gulp-sass');

gulp.task('scripts', function() {
  return gulp.src(['./js/**/*.js', '!./js/vendor/*.min.js', '!./js/modules/*.min.js', '!./js/bundle.js'])
    .pipe(order([
      "main.js",
      "directives/*.js",
      "controllers/*.js",
      "filters/*.js",
      "components/*.js",
      "services/*.js",
      "others/*.js"
    ]))
    .pipe(concat('bundle.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('./js/'));
});

gulp.task('styles', function() {
  gulp.src('sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css/'));
});

gulp.task('regenerate-search', function(){
  var fs = require('fs');
  var basePath = "./json/stable/";
  var equip = JSON.parse(fs.readFileSync(basePath + 'EquipmentList.json'));
  var mats = JSON.parse(fs.readFileSync(basePath + 'MaterialList.json'));
  var potions = JSON.parse(fs.readFileSync(basePath + 'PotionList.json'));
  var quests = JSON.parse(fs.readFileSync(basePath + 'QuestList.json'));

  function getItemType(itemSlot){
    if (itemSlot == 1) return "Weapon";
    if (itemSlot == 6) return "Trinket";
    return "Armor";
  }

  var toSave = [];
  for(var i = 0;i<equip.length;i++){
    var item = equip[i];
    if (item.itemSlot && item.image){
      toSave.push({
        name: item.name,
        type: getItemType(item.itemSlot),
        subType: item.subType,
        rarity: item.rarity,
        icon: item.image,
      });
    }
  }
  for(var i = 0;i<mats.length;i++){
    var item = mats[i];
    if (item.image && item.image.substr(-1) != "/"){
      toSave.push({
        name: item.name,
        type: "Material",
        subType: item.subType,
        rarity: item.rarity,
        icon: item.image,
      });
    }
  }
  for(var i = 0;i<potions.length;i++){
    var item = potions[i];
    if (item.image && item.image.substr(-1) != "/"){
      toSave.push({
        name: item.name,
        type: "Potion",
        subType: item.subType,
        rarity: item.rarity,
        icon: item.image,
      });
    }
  }
  
  for(var i = 0;i<quests.length;i++){
    var quest = quests[i];
    if (quest.title != "Placeholder" && quest.image.substr(-1) != "/"){
      toSave.push({
        name: quest.name,
        type: "Quest",
        subType: quest.title || "Normal",
        rarity: "1",
        icon: quest.image,
      });
    }
  }

  fs.writeFileSync(basePath + "search.json", JSON.stringify(toSave));
})

gulp.task('default', ['scripts', 'styles']);

gulp.task('dev', function(){
  var liteServer = require("lite-server");
  liteServer.server();
  gulp.watch(['./js/**/*.js', '!./js/vendor/*.min.js', '!./js/modules/*.min.js', '!./js/bundle.js'], ['scripts'])
  gulp.watch('sass/**/*.scss', ['styles'])
})