angular.module("mainApp").service("questService", function () {
    var self = this;

    self.grade = "0"
    self.luck = 0

    self.setValues = function (grade, luck) {
        self.grade = grade
        self.luck = luck || 0
    }

    self.setupQuestScope = function ($scope) {
        $scope.grade = self.grade;
        $scope.luck = Math.max(self.luck, 0);

        var gradeData = jsonGrades[$scope.grade]
        $scope.minGradeModifier = gradeData.lootModMin;
        $scope.maxGradeModifier = gradeData.lootModMax;

        $scope.nilOddsModMin = gradeData.nilOddsMin;
        $scope.nilOddsModMax = gradeData.nilOddsMax;

        if ($scope.reward3) {
            $scope.reward3NilMax = Math.max($scope.reward3.nilOdds * gradeData.nilOddsMax - self.luck, 1)
            $scope.reward3NilMin = Math.max($scope.reward3.nilOdds * gradeData.nilOddsMin - self.luck, 1)
        }
        if ($scope.reward4) {
            $scope.reward4NilMax = Math.max($scope.reward4.nilOdds * gradeData.nilOddsMax - self.luck, 1)
            $scope.reward4NilMin = Math.max($scope.reward4.nilOdds * gradeData.nilOddsMin - self.luck, 1)
        }

        if ($scope.grade == "0") {
            gradeData = jsonGrades["5"]
        }
        $scope.gradeForCap = gradeData.name
        var luckCaps = ""
        luckCaps += Math.ceil(10 * (4.5 - $scope.quest.reward1[1] * gradeData.lootModMin))
        luckCaps += " / " + Math.ceil(10 * (4.5 - $scope.quest.reward2[1] * gradeData.lootModMin))

        if ($scope.reward3) {
            luckCaps += " / " + Math.max(Math.ceil($scope.reward3.nilOdds * gradeData.nilOddsMin) - 1, 0)
        }
        if ($scope.reward4) {
            luckCaps += " / " + Math.max(Math.ceil($scope.reward4.nilOdds * gradeData.nilOddsMin) - 1, 0)
        }
        $scope.luckCaps = luckCaps

    }

    self.getMonsterByMaterialId = function (id) {
        var monsters = [];
        var listDrops = [];
        var listDropsName = [];

        var gradeData = jsonGrades[self.grade]
        var luck = self.luck
        var minGradeModifier = gradeData.lootModMin;
        var maxGradeModifier = gradeData.lootModMax;

        $.each(jsonParcel, function (i, val) {
            var totalOdds = 0;
            var min = "";
            var max = "";
            var odds = "";
            $.each(val.itemList, function (j, val2) {
                totalOdds += val2.odds;
                if (val2.id - 1 == id) {
                    if (val2.amount[5]) { min = val2.amount[0]; max = val2.amount[4] }
                    else if (val2.amount[3]) { min = val2.amount[0]; max = val2.amount[2] }
                    else { min = val2.amount[0]; max = val2.amount[0] }
                    odds = val2.odds

                    var indexOf = listDropsName.indexOf(i)
                    if (indexOf < 0) { listDropsName.push(i); }
                }
            });

            if (odds) {
                var oddsMin = odds / (totalOdds + Math.max(val.nilOdds * gradeData.nilOddsMax - self.luck, 1)) * 100;
                var oddsMax = odds / (totalOdds + Math.max(val.nilOdds * gradeData.nilOddsMin - self.luck, 1)) * 100;
                var temp = { "name": i, "min": min, "max": max, "oddsMin": oddsMin, "oddsMax": oddsMax }
                listDrops.push(temp);
            }
        });

        function createMonsterFrom1_2Reward(val, reward, isB, questIdx) {
            return {
                name: isB ? val.nameB : val.name,
                rarity: isB ? val.titleB : val.title,
                icon: val.image,
                oddsMin: 100,
                oddsMax: 100,
                min: Math.min(reward[1] * minGradeModifier + luck * 0.1, 5), 
                max: Math.min(reward[2] * maxGradeModifier + luck * 0.1, 5),
                region: regionById(val.region),
                gid: questIdx
            }
        }

        function createMonsterFrom3_4Reward(val, indexOfReward, isB, questIdx) {
            return {
                name: isB ? val.nameB : val.name,
                rarity: isB ? val.titleB : val.title,
                icon: val.image,
                oddsMin: listDrops[indexOfReward].oddsMin, 
                oddsMax: listDrops[indexOfReward].oddsMax,
                min: listDrops[indexOfReward].min, 
                max: listDrops[indexOfReward].max, 
                region: regionById(val.region),
                gid: questIdx
            }
        }

        $.each(jsonQuests, function (index, val) {
            if (val.title != "Placeholder") {
                if (val.rewardA1[0] - 1 == id) {
                    var monster = createMonsterFrom1_2Reward(val, val.rewardA1, false, index)
                    monsters.push(monster)
                }
                else if (val.rewardA2[0] - 1 == id) {
                    var monster = createMonsterFrom1_2Reward(val, val.rewardA2, false, index)
                    monsters.push(monster)
                }

                var indexOf = listDropsName.indexOf(val.rewardA3)
                if (indexOf > -1) {
                    var monster = createMonsterFrom3_4Reward(val, indexOf, false, index)
                    monsters.push(monster)
                }

                indexOf = listDropsName.indexOf(val.rewardA4)
                if (indexOf > -1) {
                    var monster = createMonsterFrom3_4Reward(val, indexOf, false, index)
                    monsters.push(monster)
                }

                if (val.hasOwnProperty("nameB")) {
                    if (val.rewardB1[0] - 1 == id) {
                        var monster = createMonsterFrom1_2Reward(val, val.rewardB1, true, index)
                        monsters.push(monster)
                    }
                    else if (val.rewardB2[0] - 1 == id) {
                        var monster = createMonsterFrom1_2Reward(val, val.rewardB2, true, index)
                        monsters.push(monster)
                    }

                    indexOf = listDropsName.indexOf(val.rewardB3)
                    if (indexOf > -1) {
                        var monster = createMonsterFrom3_4Reward(val, indexOf, true, index)
                        monsters.push(monster)
                    }
                    indexOf = listDropsName.indexOf(val.rewardB4)
                    if (indexOf > -1) {
                        var monster = createMonsterFrom3_4Reward(val, indexOf, true, index)
                        monsters.push(monster)
                    }
                }
            }
        })
        return monsters;
    }
})