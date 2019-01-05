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
                name:"None"
            },
            {
                name:"1"
            }
        ]
        $scope.prestigeLevel = "0";

        if ($routeParams.prestigeLevel) { //If there is a ?prefix=x in the URL
            $scope.prestigeLevel = $routeParams.prestigeLevel
        }
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

    self.getLevelForAscendedItem = function (item, ascLevel) {
        if (ascLevel && ascLevel > 0) {
            return item.itemLevel + 40
        }
        return item.itemLevel
    }

    self.getBaseStat = function ($scope, name) {
        var level = self.getLevelForAscendedItem($scope.item, +$scope.prestigeLevel)
        var baseStat = $scope.itemBaseStat[name + "Base"]
        var plvlStat = $scope.itemBaseStat[name + "Lvl"]
        return baseStat + plvlStat * level
    }

    var av = {
        none: [1, 1],
        min: [1.1, 1.2],
        low: [1.25, 1.5],
        mid: [1.5, 2],
        high: [2, 3],
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
        critBns: av.mid,
        defBns: av.high,
        mdefBns: av.high,
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

                var prestigeLevel = + $scope.prestigeLevel
                if (prestigeLevel > 0) {
                    var mult = self.getAscendingMulti(key, prestigeLevel)
                    min = Math.round(min* mult)
                    max = Math.round(max* mult)
                }
                newBonus[key] = [min, max]
            }
        }

        console.log("bonus stats", newBonus)
        return newBonus
    }
});