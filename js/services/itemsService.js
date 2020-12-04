angular.module("mainApp").service("itemsService", function () {
    var self = this;

    self.getItemQuality = function (item, hasPrefix, hasSuffix) {
        var maximum = item.rarity < 7 ? 6 : 8;
        var current = item.rarity;
        if (hasPrefix) {
            current++;
        }
        if (hasSuffix) {
            current++;
        }
        return Math.min(current, maximum);
    }

    self.initGradeFromRoute = function ($scope, $routeParams) {
        $scope.listOfGrades = jsonGrades;
        if ($routeParams.grade) { //If there is a ?grade=x in the URL
            $scope.grade = $routeParams.grade;
        } else {
            $scope.grade = "0";
        }
        $scope.minGradeModifier = jsonGrades[$scope.grade].min;
        $scope.maxGradeModifier = jsonGrades[$scope.grade].max;
        $scope.craftTimeMin = jsonGrades[$scope.grade].craftTimeMin;
        $scope.craftTimeMax = jsonGrades[$scope.grade].craftTimeMax;
        $scope.gradeName = jsonGrades[$scope.grade].name;
    }

    self.initSuffixFromRoute = function ($scope, $routeParams) {
        $scope.listOfSuffix = jsonSuffixes;
        $scope.suffix = "0";

        if ($routeParams.suffix) { //If there is a ?suffix=x in the URL
            $scope.suffix = $routeParams.suffix;
        }
        $scope.hasSuffix = $scope.suffix > 0;
        $scope.suffixMod = 1 + getSuffixMod($scope.suffix);
    }

    self.initPrefixFromRoute = function ($scope, $routeParams) {
        $scope.listOfPrefix = jsonPrefixes;
        $scope.prefix = "0";

        if ($routeParams.prefix) { //If there is a ?prefix=x in the URL
            $scope.prefix = $routeParams.prefix;
            $scope.prefixStat = self.getPrefixById($scope.prefix);
        }
        $scope.hasPrefix = $scope.prefix > 0;
    }

    self.initPrestigeLevelFromRoute = function ($scope, $routeParams) {
        //todo: move item prestige params to json file
        $scope.listOfItemPrestige = [
            {
                name: "None"
            },
            {
                name: "1"
            },
            {
                name: "2"
            }
        ]
        $scope.prestigeLevel = "0";

        if ($routeParams.prestigeLevel) {
            $scope.prestigeLevel = $routeParams.prestigeLevel
        }

        var plevelNumber = +$scope.prestigeLevel
        $scope.prestigeLevelNumber = isNaN(plevelNumber) ? 0 : plevelNumber
    }

    self.initFromRoute = function ($scope, $routeParams) {
        self.initGradeFromRoute($scope, $routeParams);
        if ($scope.item.crafterID != 6) {
            self.initSuffixFromRoute($scope, $routeParams);
        }
        self.initPrefixFromRoute($scope, $routeParams);
        self.initPrestigeLevelFromRoute($scope, $routeParams);
        self.initQuality($scope);

        $scope.itemValue = self.getItemValue($scope.item, $scope.prestigeLevelNumber)
    }

    self.getItemValue = function (itemData, prestigeLevel) {
        var value = itemData.value
        if (prestigeLevel && prestigeLevel > 0) {
            value = value * 2 * prestigeLevel
        }
        return value
    }

    self.getPrefixById = function (prefixId) {
        return jsonPrefixes[prefixId];
    }

    self.initQuality = function ($scope) {
        $scope.finalRarity = self.getItemQuality($scope.item, $scope.hasPrefix, $scope.hasSuffix)
    }

    self.getStatAfterGrade = function (input, gradeMultiplier) {
        var result;
        if (input <= -1) {
            result = input / gradeMultiplier; //negative stats handling
        } else if (input < 1 && input > -1) {
            result = input * 100 - 1e-7; // percent stats handling. 1e-7 for rounding issues
        } else {
            result = input * gradeMultiplier;
        }
        return Math.ceil(result)
    }

    var prestigeLevelBonus = [40, 80]

    self.getLevelForAscendedItem = function (item, ascLevel) {
        if (ascLevel && ascLevel > 0) {
            return item.itemLevel + prestigeLevelBonus[ascLevel - 1]
        }
        return item.itemLevel
    }

    self.getBaseStat = function ($scope, name) {
        var level = self.getLevelForAscendedItem($scope.item, $scope.prestigeLevelNumber)
        var baseStat = $scope.itemBaseStat[name + "Base"]
        var plvlStat = $scope.itemBaseStat[name + "Lvl"]
        return baseStat + plvlStat * level
    }

    var av = {
        none: [1, 1],
        min: [1.1, 1.2],
        low: [1.25, 1.5],
        mid: [1.5, 2],
        high: [1.75,2.5],
        super: [2,3]
    }
    var ascStat = {
        str: av.high,
        int: av.high,
        dex: av.high,
        lckMod: av.low,
        expMod: av.low,
        atkBns: av.high,
        matkBns: av.high,
        accBns: av.mid,
        critBns: av.min,
        defBns: av.mid,
        mdefBns: av.mid,
        hpBns: av.high,
        apMod: av.none,
        speed: av.none,
        atkPct: av.low,
        matkPct: av.low,
        defPct: av.low,
        mdefPct: av.low,
        accPct: av.low,
        hpPct: av.low,
        critMod: av.low,
    }
    self.getAscendingMulti = function (key, ascLevel) {
        return ascStat[key][ascLevel - 1]
    }

    self.prepareBonusStats = function ($scope) {
        var newBonus = {}
        var bonus = $scope.item.bonusStat
        for (var key in bonus) {
            if (bonus.hasOwnProperty(key)) {
                var value = bonus[key]
                var min = self.getStatAfterGrade(value[0], $scope.minGradeModifier)
                var max = self.getStatAfterGrade(value[1], $scope.maxGradeModifier)

                var prestigeLevel = $scope.prestigeLevelNumber
                if (prestigeLevel > 0) {
                    var mult = self.getAscendingMulti(key, prestigeLevel)
                    min = Math.ceil(min * mult)
                    max = Math.ceil(max * mult)
                }
                newBonus[key] = [min, max]
            }
        }

        //console.log("bonus stats", newBonus)
        return newBonus
    }

    self.constructUrl = function ($scope, baseUrl) {
        var objectURL = baseUrl

        var hasParam = false
        if ($scope.suffix && $scope.suffix > 0) {
            objectURL += "?suffix=" + $scope.suffix
            hasParam = true
        }
        if ($scope.prefix && $scope.prefix > 0) {
            objectURL += (hasParam ? "&" : "?") + "prefix=" + $scope.prefix
            hasParam = true
        }
        if ($scope.grade && $scope.grade > 0) {
            objectURL += (hasParam ? "&" : "?") + "grade=" + $scope.grade
            hasParam = true
        }
        if ($scope.prestigeLevel && $scope.prestigeLevel > 0) {
            objectURL += (hasParam ? "&" : "?") + "prestigeLevel=" + $scope.prestigeLevel
            hasParam = true
        }
        $(location).attr('href', objectURL);
    }
});