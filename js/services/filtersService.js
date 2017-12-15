
angular.module("mainApp").service("filtersService", function () {
    var self = this;
    
    self.isMatch = function (value, currentFilters) {
        var filter = currentFilters[value];
        return filter && filter.selected;
    }

    self.getTiers = function () {
        return {
            1: { title: "1" },
            2: { title: "2" },
            3: { title: "3" },
            4: { title: "4" },
            5: { title: "5" },
            6: { title: "6" },
        }
    }

    self.getBlacksmithTypes = function () {
        return {
            "Dagger": { title: "Dagger" },
            "Sword": { title: "Sword" },
            "Hatchet": { title: "Hatchet" },
            "Knife": { title: "Knife" },
            "Longsword": { title: "Longsword" },
            "Axe": { title: "Axe" },
        }
    }

    self.getWoodworkerTypes = function () {
        return {
            "Wand": { title: "Wand" },
            "Mystic Wand": { title: "Mystic Wand" },
            "Stave": { title: "Stave" },
            "Mystic Stave": { title: "Mystic Stave" },
            "Cudgel": { title: "Cudgel" },
            "Club": { title: "Club" },
        }
    }

    self.getSpecialTypes = function () {
        return {
            "Dagger": { title: "Rod" },
            "Sword": { title: "Pole" },
            "Hatchet": { title: "Trident" },
            "Knife": { title: "Spellsword" },
            "Longsword": { title: "Scythe" },
        }
    }

    self.getArmorsmithTypes = function () {
        return {
            "Bracers": { title: "Bracers" },
            "Greaves": { title: "Greaves" },
            "Helm": { title: "Helm" },
            "Chainmail": { title: "Chainmail" },
            "Gauntlets": { title: "Gauntlets" },
            "Sabatons": { title: "Sabatons" },
            "Great Helm": { title: "Great Helm" },
            "Platemail": { title: "Platemail" },
        }
    }

    self.getClothWorkerTypes = function () {
        return {
            "Gloves": { title: "Gloves" },
            "Boots": { title: "Boots" },
            "Hood": { title: "Hood" },
            "Tunic": { title: "Tunic" },
            "Mitts": { title: "Mitts" },
            "Crakows": { title: "Crakows" },
            "Hat": { title: "Hat" },
            "Robe": { title: "Robe" },
        }
    }

    self.getPotionsTypes = function () {
        return {
            Health: { title: "Health" },
            Boost: { title: "Boost" },
            Enchant: { title: "Enchant" },
        }
    }

    self.getMaterialTypes = function () {
        return {
            ore: { title: "Ore" },
            metal: { title: "Metal" },
            log: { title: "Log" },
            cloth: { title: "Cloth" },
            herb: { title: "Herb" },
            limb: { title: "Limb" },
            scale: { title: "Scale" },
            tooth: { title: "Tooth" },
            fur: { title: "Fur" },
            plate: { title: "Plate" },
            blade: { title: "Blade" },
            hilt: { title: "Hilt" },
            crystal: { title: "Crystal" },
            gem: { title: "Gem" },
            rune: { title: "Rune" },
            shell: { title: "Shell" },
            claw: { title: "Claw" },
            horn: { title: "Horn" },
            misc: { title: "Misc" },
            fang: { title: "Fang" },
            wing: { title: "Wing" },
        }
    }

})