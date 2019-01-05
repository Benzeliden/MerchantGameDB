var gulp = require('gulp');
var concat = require('gulp-concat');
var order = require("gulp-order");
var uglify = require("gulp-uglify");
var ngAnnotate = require('gulp-ng-annotate');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var fs = require('fs');
var runSequence = require('run-sequence');

function checkDevelopment() {
  //console.log("Node environment", process.env.NODE_ENV);
  return process.env.NODE_ENV === 'dev';
}

gulp.task('scripts', function () {
  var scriptsPipe = gulp.src(['./js/**/*.js', '!./js/vendor/*.min.js', '!./js/modules/*.min.js', '!./js/bundle.js', '!./js/jsonDB.js'])
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
    .pipe(ngAnnotate());

  if (!checkDevelopment()) {
    scriptsPipe = scriptsPipe.pipe(uglify());
  }
  return scriptsPipe.pipe(gulp.dest('./js/'));
});

gulp.task('styles', function () {
  var cssPipe = gulp.src('sass/**/*.scss')
    .pipe(sass().on('error', sass.logError));

  if (!checkDevelopment()) {
    cssPipe = cssPipe.pipe(cleanCSS());
  }
  return cssPipe.pipe(gulp.dest('./css/'));
});

gulp.task('regenerate-search', function (callback) {
  var basePath = "./json/";
  var equip = JSON.parse(fs.readFileSync(basePath + 'EquipmentList.json'));
  var mats = JSON.parse(fs.readFileSync(basePath + 'MaterialList.json'));
  var potions = JSON.parse(fs.readFileSync(basePath + 'PotionList.json'));
  var quests = JSON.parse(fs.readFileSync(basePath + 'QuestList.json'));

  function getItemType(itemSlot) {
    if (itemSlot == 1) return "Weapon";
    if (itemSlot == 6) return "Trinket";
    return "Armor";
  }

  var presetMatTiers = {
    "Grokage": 0
  }
  var presetItemsTiers = {
    "Goblin Ring": 1, //have craft recipe with Grokage
    "Grok's Amulet": 0,
  }

  function getMaterialTier(material) {
    var presetTier = presetMatTiers[material.name]
    if (presetTier !== undefined) {
      return presetTier
    }
    var tier = Math.floor(material.itemLevel / 10) + 1
    if (material.itemLevel % 10 == 0 && material.rarity > 2) {
      //example: common lvl 20 material belong to t3, but rare and above belong to t2
      tier -= 1;
    }
    return tier
  }

  function getMaterialTierFromRecipe(item) {
    var presetTier = presetItemsTiers[item.name]
    if (presetTier !== undefined) {
      return presetTier
    }
    var ids = item.materialID
    for (var i = 0; i < ids.length; i++) {
      if (item.materialType == undefined || item.materialType[i] == undefined) {
        if (newMats[ids[i] - 1] == undefined) {
          console.log("wtf", item.name, ids[i] - 1, newMats.length)
          return Math.floor((item.itemLevel - 0.1) / 10) + 1
        }
        return newMats[ids[i] - 1].dbTier
      }
    }
    //console.log("warning: can't get tier for item", item.name)
    return Math.floor((item.itemLevel - 0.1) / 10) + 1
  }

  var toSave = [], newEquip = [], newMats = [], newPotions = [], newQuests = [];

  for (var i = 0; i < mats.length; i++) {
    var item = mats[i];
    if (item.image && item.image.substr(-1) != "/" &&
      item.image != "Materials/Region_6/Chieftains_Blade.png") {
      item.dbTier = getMaterialTier(item)
      newMats.push(item);
      toSave.push({
        name: item.name,
        type: "Material",
        subType: item.subType,
        rarity: item.rarity,
        icon: item.image,
      });
    } else {
      newMats.push({ name: item.name });//clean not existing items
    }
  }
  for (var i = 0; i < equip.length; i++) {
    var item = equip[i];
    if (item.itemSlot && item.image) {
      item.dbTier = getMaterialTierFromRecipe(item)

      newEquip.push(item);
      toSave.push({
        name: item.name,
        type: getItemType(item.itemSlot),
        subType: item.subType,
        rarity: item.rarity,
        icon: item.image,
      });
    } else {
      newEquip.push({ name: item.name });//clean not existing items
    }
  }
  for (var i = 0; i < potions.length; i++) {
    var item = potions[i];
    if (item.image && item.image.substr(-1) != "/") {
      item.dbTier = getMaterialTierFromRecipe(item)

      newPotions.push(item);
      toSave.push({
        name: item.name,
        type: "Potion",
        subType: item.subType,
        rarity: item.rarity,
        icon: item.image,
      });
    } else {
      newPotions.push({});//clean not existing items
    }
  }

  for (var i = 0; i < quests.length; i++) {
    var quest = quests[i];
    if (quest.title != "Placeholder" && quest.image.substr(-1) != "/") {
      newQuests.push(quest);
      toSave.push({
        name: quest.name,
        type: "Quest",
        subType: quest.title || "Normal",
        rarity: "1",
        icon: quest.image,
      });
      if (quest.nameB != null) {
        toSave.push({
          name: quest.nameB,
          type: "Quest",
          subType: quest.titleB || "Rare",
          rarity: "1",
          icon: quest.image, //imageB is not used in the game currently
        });
      }
    } else {
      newQuests.push({ title: "Placeholder" });//clean not existing items
    }
  }

  fs.writeFileSync(basePath + "search.json", JSON.stringify(toSave));

  fs.writeFileSync(basePath + "EquipmentList.json", JSON.stringify(newEquip));
  fs.writeFileSync(basePath + "MaterialList.json", JSON.stringify(newMats));
  fs.writeFileSync(basePath + "PotionList.json", JSON.stringify(newPotions));
  fs.writeFileSync(basePath + "QuestList.json", JSON.stringify(newQuests));
  callback();
})

gulp.task('pack-json', function () {
  var jsoncombine = require("gulp-jsoncombine");

  return gulp.src("./json/*.json")
    .pipe(jsoncombine("jsonDB.js", function (data) {
      var jsonDb = "var jsonData = " + JSON.stringify(data) +
        ";var jsonSearch = jsonData.search;" +
        "var jsonEquipments = jsonData.EquipmentList;" +
        "var jsonFormulas = jsonData.FormulaList;" +
        "var jsonHeroes = jsonData.HeroList;" +
        "var jsonMaterials = jsonData.MaterialList;" +
        "var jsonPotions = jsonData.PotionList;" +
        "var jsonQuests = jsonData.QuestList;" +
        "var jsonPrefixes = jsonData.PrefixList;" +
        "var jsonSuffixes = jsonData.SuffixList;" +
        "var jsonGrades = jsonData.GradeList;" +
        "var jsonBosses = jsonData.EventList;" +
        "var jsonParcel = jsonData.ParcelList;" +
        "var jsonAbility = jsonData.AbilityList;" +
        "var jsonRarity = jsonData.rarityMod;";
      return new Buffer(jsonDb);
    }))
    .pipe(gulp.dest("./js/"));
});

//pack all mostly used assets in spritesheets. 
//Should be executed after regenerate-search, which clean up not existing items
//optipng tool will greatly reduce file size (~50%)
gulp.task('sprites', function (callback) {
  var fs_extra = require('fs-extra')
  var gulpif = require('gulp-if');
  var spritesmith = require('gulp.spritesmith');
  var jsonPath = "./json/";
  var quests = JSON.parse(fs.readFileSync(jsonPath + 'QuestList.json'));
  var skills = JSON.parse(fs.readFileSync(jsonPath + 'AbilityList.json'));

  for (var i = 0; i < quests.length; i++) {
    var quest = quests[i];
    if (quest.title != "Placeholder" && quest.image.substr(-1) != "/") {
      fs_extra.copySync("./assets/Quests/" + quest.image + ".png", "./tempSprites/Quests/" + quest.image + ".png", { overwrite: false });
      console.log("processing", quest.image)
    }
  }
  var used = {};
  for (var i in skills) {
    if (skills.hasOwnProperty(i) && skills[i].image.indexOf("/.png") == -1) {
      var skill = skills[i];
      if (used[skill.image] == undefined) {
        used[skill.image] = true;
        fs_extra.copySync("./assets/" + skill.image, "./tempSprites/" + skill.image, { overwrite: false });
      }
    }
  }

  var successRequire = 2, successCurrent = 0;
  function makeCallbacks(stream) {
    stream.on('end', function () { console.log("success + 1"); successCurrent++; if (successCurrent == successRequire) { callback(); } });
    stream.on('error', function (err) { console.log("error", err); callback(err); });
    stream.on('cancel', function () { console.log("cancel?"); });
  }

  function makeImgStream(folderName, spritesheetName, prefixName) {
    function spriteToCssClass(sprite) {
      let sourceImg = sprite.source_image
      let idx = sourceImg.indexOf("tempSprites") + 12 + folderName.length + 1
      let finalClass = sourceImg.substr(idx, sourceImg.length - idx - 4).replace("\\", "-")
      return '.' + prefixName + "-" + finalClass
    }

    var spriteData = gulp
      .src('./tempSprites/' + folderName + '/**/*.png')
      .pipe(spritesmith({
        imgName: spritesheetName + '.png',
        cssName: spritesheetName + '.css',
        imgPath: "/MerchantGameDB/img/spritesheets/" + spritesheetName + ".png",
        cssTemplate: function (data) {

          var spriteW = data.sprites[0].width
          var spriteH = data.sprites[0].height
          var sameSize = true

          for (var i = 1; i < data.sprites.length; i++) {
            if (data.sprites[i].width != spriteW || data.sprites[i].height != spriteH) {
              sameSize = false
              break
            }
          }

          var result = `.${prefixName} {background-image:url(${data.spritesheet.image})`

          if (sameSize) {
            result = result + `;width:${data.sprites[0].px.width};height:${data.sprites[0].px.height}`
          }
          result = result + "}"

          for (var i = 0; i < data.sprites.length; i++) {
            var sprite = data.sprites[i]
            result = result + `${spriteToCssClass(sprite)}{background-position:${sprite.px.offset_x} ${sprite.px.offset_y}`

            if (!sameSize) {
              result = result + `;width:${sprite.px.width};height:${sprite.px.height}`
            }
            result = result + "}"
          }

          return result;
        },
        cssOpts: {
          cssSelector: spriteToCssClass
        }
      }));

    var stream = spriteData.pipe(
      gulpif('*.png', gulp.dest('./img/spritesheets/'), gulp.dest('./tempSprites/')));
      
    console.log("wtf")
    makeCallbacks(stream);
  }

  makeImgStream("Quests", "quests_sprites", "ico-quest");
  makeImgStream("Skills", "skills_sprites", "ico-skill");
});

gulp.task('sprites-css-min', function () {
  return gulp.src("tempSprites/*.css")
    .pipe(cleanCSS())
    .pipe(concat("all-spritesheets.css"))
    .pipe(gulp.dest("./css/"));
})

//required: extract assets before running this
gulp.task('build-new-version', function (callback) {
  runSequence('regenerate-search',
    'pack-json', 'sprites',
    'sprites-css-min', callback);
})

gulp.task('default', ['scripts', 'styles']);

gulp.task('dev-watch', function () {
  var liteServer = require("lite-server");
  liteServer.server();
  gulp.watch(['./js/**/*.js', '!./js/vendor/*.min.js', '!./js/modules/*.min.js', '!./js/bundle.js'], ['scripts']);
  gulp.watch('sass/**/*.scss', ['styles']);
});

gulp.task('dev', ['default', 'dev-watch']);