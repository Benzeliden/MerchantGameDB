angular.module("mainApp").service("regionService", function () {
    var self = this;

    var sameStats = ["image", "levelReq", "region", "attackList"]
    var differentStats = ["name", "nickname", "enemyImage",
        "title", "exp", "gold", "time",
        "enemyHp", "enemyAtk", "enemyMatk", "enemyDef", "enemyMdef", "enemyEva"]


    self.mapQuestData = function (questData, isRare, idx) {
        var result = {}

        for (var i = 0; i < sameStats.length; i++) {
            var statName = sameStats[i]
            result[statName] = questData[statName]
        }
        for (var i = 0; i < differentStats.length; i++) {
            var statName = differentStats[i]
            var sourceName = statName
            if (isRare) {
                sourceName += "B"
            }
            result[statName] = questData[sourceName]
        }

        for (var i = 1; i <= 4; i++) {
            var sourceName = "reward" + (isRare ? "B" : "A") + i
            result["reward" + i] = questData[sourceName]
        }

        result.region2 = regionById(questData.region);
        var questSize = 1;
        if (questData.hasOwnProperty("questSize")) {
            questSize = questData.questSize;
        }
        result.questSize = questSize

        if (result.title.length == 0) {
            result.title = "Normal";
        }

        result.type = isRare ? "b" : "a"

        var other = "";
        if (isRare) {
            other = questData.name
        } else if (questData.hasOwnProperty("nameB")) {
            other = questData.nameB;
        }
        result.other = other
        result.gid = idx

        return result
    }

    self.getQuestByName = function (name, questId) {
        var questData, idx
        if (questId) {
            questData = jsonQuests[questId]
            idx = questId
        } else {
            $.each(jsonQuests, function (index, val) {
                if (val.name == name) {
                    questData = val
                    idx = index
                    return false;
                }
                else if (val.nameB == name) {
                    questData = val
                    idx = index
                    return false;
                }
            })
        }

        return self.mapQuestData(questData, questData.nameB == name, idx);
    }

    self.getQuestsForRegion = function (regionName) {
        var regio = 0;
        if (regionName == "Tuvale Forest") { regio = 1 }
        else if (regionName == "Yarsol Cove") { regio = 2 }
        else if (regionName == "Aldur Highlands") { regio = 3 }
        else if (regionName == "Vulkrum Badlands") { regio = 4 }
        else if (regionName == "Grimhal Volcano") { regio = 5 }
        else if (regionName == "Frentir Chasm") { regio = 6 }

        var quests = []
        $.each(jsonQuests, function (index, val) {
            if (val.region == regio && val.title != "Placeholder") {
                quests.push(self.mapQuestData(val, false, index));
                if (val.nameB) {
                    quests.push(self.mapQuestData(val, true, index));
                }
            }
        });
        return quests;
    }
})