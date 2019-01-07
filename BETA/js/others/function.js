
function getSuffixMod(suff) {
	if(jsonSuffixes[suff].hasOwnProperty("stats")) {
		return jsonSuffixes[suff].stats.atk;
	}
	else {
		return ".0";
	}
}

function getEquipmentByName(name) {
	var item = "";
	$.each(jsonEquipments, function(index, val) {
		if(name == val.name){
			item = val;
			return false;
		}
	})
	return item;
}

function getEquipmentNameById(id) {
	return jsonEquipments[id-1].name;
}

function getEquipmentIdByName(name) {
	var variable= "";
	$.each(jsonEquipments, function(index, val) {
		if(val.name == name) {
			variable = index;
			return false; //this is the break
		}
	})
	return variable;
}

function getPrefixIdByName(name) {
	var variable= "";
	$.each(jsonPrefixes, function(index, val) {
		if(val.name == name) {
			variable = index;
			return false; //this is the break
		}
	})
	return variable;
}

function getPotionIdByName(name) {
	var variable= "";
	$.each(jsonPotions, function(index, val) {
		if(val.name == name) {
			variable = index;
			return false; //this is the break
		}
	})
	return variable;
}

function getBaseStatByType(type) {
	return jsonFormulas[type];
}

function getMaterialById(materials, amount) {
	var mats = [];
	$.each(materials, function(index, val) {
			var search = jsonMaterials[val-1];
			var matInfo = {name: search.name, amount: amount[index], rarity: search.rarity, icon: search.image, what:"material"};
			mats.push(matInfo);
	})
	return mats;
}

function getMaterialByIdSpec(materials, amount, types) {
	var mats = [];
	$.each(materials, function(index, val) {
		if(types[index])
			{
			var search = "";
			var what = "";
			if(types[index] == "consumable")
				{
				var search = jsonPotions[val-1];
				what = "potion";
				}
			else if(types[index] == "equipment")
				{
				var search = jsonEquipments[val-1];
				if(jsonEquipments[val-1].itemSlot == 1)
					{
					what = "weapon";
					}
				else if(jsonEquipments[val-1].itemSlot == 6)
					{
					what = "trinket";
					}
				else
					{
					what = "armor";
					}
				}

			var matInfo = {name: search.name, amount: amount[index], rarity: search.rarity, icon: search.image, what:what};
			mats.push(matInfo);
			}
		else
			{
			var search = jsonMaterials[val-1];
			var matInfo = {name: search.name, amount: amount[index], rarity: search.rarity, icon: search.image, what:"material"};
			mats.push(matInfo);
			}
	})
	return mats;
}

function getMaterialNameById(id) {
	return jsonMaterials[id-1].name;
}

function getMaterialByName(name) {
	var mat = "";
	$.each(jsonMaterials, function(index, val) {
		if(name == val.name){
			mat = val;
			return false;
		}
	})
	return mat;
}

function getMaterialIdByName(name) {
	var mat= "";
	$.each(jsonMaterials, function(index, val) {
		if(val.name == name) {
			mat = index;
			return false;
		}
	})
	return mat;
}

function getMonsterByTrinketId(id) {
	var monsters = [];
	//if dropped by 100% (slot 1-2)
	$.each(jsonQuests, function(index, val) {
		if (val.hasOwnProperty("trinketA") && (val.trinketA[0]-1 == id)) {
				var currentMonster = val.trinketA[0]-1;
				var monsterInfo = {name: val.name, region: val.region, icon: val.image, rarity: val.title, dropRate: val.trinketA[1]};
				monsterInfo.region = regionById(val.region);
				monsters.push(monsterInfo);
		}
		if (val.hasOwnProperty("trinketB") && (val.trinketB[0]-1 == id)) {
				var currentMonster = val.trinketB[0]-1;
				var monsterInfo = {name: val.nameB, region: val.region, icon: val.image, rarity: val.titleB, dropRate: val.trinketB[1]};
				monsterInfo.region = regionById(val.region);
				monsters.push(monsterInfo);
		}
	})
	
	//if dropped by rng (slot 3-4)
	var listDrops = [];
	var listDropsName = [];

	$.each(jsonParcel, function(i, val) {
		var totalOdds = 0;
		var min = "";
		var max = "";
		var odds = "";
		$.each(val.itemList, function(j, val2) {
			totalOdds += val2.odds;
			if(val2.id[1]-1 == id)
				{
				if(val2.amount[5]){min = val2.amount[0]; max = val2.amount[4]}
				else if(val2.amount[3]){min = val2.amount[0]; max = val2.amount[2]}
				else{min = val2.amount[0]; max = val2.amount[0]}
				odds = val2.odds
				
				var indexOf = listDropsName.indexOf(i)
				if(indexOf < 0)
					{listDropsName.push(i);}
				}
		});
		
		if(odds)
			{
			var oddsMin = odds/(totalOdds+val.nilOdds*1.25)*100;
			var oddsMax = odds/(totalOdds+val.nilOdds*0.75)*100;
			var temp = {"name": i, "min":min, "max":max, "oddsMin":oddsMin, "oddsMax":oddsMax}
			listDrops.push(temp);
			}
	});

	$.each(jsonQuests, function(index, val) {
		if(val.title != "Placeholder")
			{
			var indexOf = listDropsName.indexOf(val.rewardA3)
			if(indexOf > -1)
				{
				var monster = {name: val.name, rarity: val.title, icon: val.image, oddsMin: listDrops[indexOf].oddsMin, oddsMax: listDrops[indexOf].oddsMax, min: listDrops[indexOf].min, max: listDrops[indexOf].max,region: regionById(val.region)}
				monsters.push(monster)
				}
				
			indexOf = listDropsName.indexOf(val.rewardA4)
			if(indexOf > -1)
				{
				var monster = {name: val.name, rarity: val.title, icon: val.image, oddsMin: listDrops[indexOf].oddsMin, oddsMax: listDrops[indexOf].oddsMax, min: listDrops[indexOf].min, max: listDrops[indexOf].max,region: regionById(val.region)}
				monsters.push(monster)
				}
			if(val.hasOwnProperty("nameB"))
				{
				indexOf = listDropsName.indexOf(val.rewardB3)
				if(indexOf > -1)
					{
					var monster = {name: val.nameB, rarity: val.titleB, icon: val.image, oddsMin: listDrops[indexOf].oddsMin, oddsMax: listDrops[indexOf].oddsMax, min: listDrops[indexOf].min, max: listDrops[indexOf].max,region: regionById(val.region)}
					monsters.push(monster)
					}		
				indexOf = listDropsName.indexOf(val.rewardB4)
				if(indexOf > -1)
					{
					var monster = {name: val.nameB, rarity: val.titleB, icon: val.image, oddsMin: listDrops[indexOf].oddsMin, oddsMax: listDrops[indexOf].oddsMax, min: listDrops[indexOf].min, max: listDrops[indexOf].max,region: regionById(val.region)}
					monsters.push(monster)
					}	
				}
			}
		});

	// console.log(listDrops);
	// console.log(listDropsName);
	// console.log(monsters);
	
	return monsters;
}

function regionById(id) {
	var region = "";
	if (id == 1) { region = "Tuvale Forest"}
	else if (id == 2) { region = "Yarsol Cove"}
	else if (id == 3) { region = "Aldur Highlands"}
	else if (id == 4) { region = "Vulkrum Badlands"}
	else if (id == 5) { region = "Grimhal Volcano"}
	else if (id == 6) { region = "Frentir Chasm"}
	return region;
}

function getHeroByName(name) {
	var hero = "";
	$.each(jsonHeroes, function(index, val) {
		if(val.name == name)
			{
			hero = val
			return false;
			}
	})
	return hero;
}

function getPotionByName(name) {
	var pot = "";
	$.each(jsonPotions, function(index, val) {
		if(val.name == name)
			{
			pot = val
			return false;
			}
	})
	return pot;
}

function getQuestByName(name) {
	var quest = "";
	$.each(jsonQuests, function(index, val) {
		if(val.name == name)
			{
			val.region2 = regionById(val.region);
			var questSize = 1;
			if(val.hasOwnProperty("questSize"))
				{
				questSize = val.questSize;
				}
			if(val.title.length == 0)
				{
				val.title = "Normal";
				}
				
			var other = "";
			if(val.hasOwnProperty("nameB"))
				{
				other = val.nameB;
				}
			
			// console.log(val.title.length);
			quest = {
					"name": val.name,
					"nickname": val.nickname,
					"image":val.image,
					"enemyImage":val.enemyImage,
					"title":val.title,
					"levelReq":val.levelReq,
					"exp":val.exp,
					"gold":val.gold,
					"time":val.time,
					"enemyHp":val.enemyHp,
					"enemyAtk":val.enemyAtk,
					"enemyMatk":val.enemyMatk,
					"enemyDef":val.enemyDef,
					"enemyMdef":val.enemyMdef,
					"enemyEva":val.enemyEva,
					"reward1":val.rewardA1,
					"reward2":val.rewardA2,
					"reward3":val.rewardA3,
					"reward4":val.rewardA4,
					"region":val.region,
					"region2":val.region2,
					"questSize":questSize,
					"other":other,
					"type":"a",
					"attackList":val.attackList
					};
			return false;
			}
		else if(val.nameB == name)
			{
			val.region2 = regionById(val.region)
			var questSize = 1;
			if(val.hasOwnProperty("questSize"))
				{
				questSize = val.questSize;
				}
			if(val.title.length == 0)
				{
				val.title = "Normal";
				}
			quest = {
					"name": val.nameB,
					"nickname": val.nicknameB,
					"image":val.image, // currently in game imageB is not used
					"enemyImage":val.enemyImageB,
					"title":val.titleB,
					"levelReq":val.levelReq,
					"exp":val.expB,
					"gold":val.goldB,
					"time":val.timeB,
					"enemyHp":val.enemyHpB,
					"enemyAtk":val.enemyAtkB,
					"enemyMatk":val.enemyMatkB,
					"enemyDef":val.enemyDefB,
					"enemyMdef":val.enemyMdefB,
					"enemyEva":val.enemyEvaB,
					"reward1":val.rewardB1,
					"reward2":val.rewardB2,
					"reward3":val.rewardB3,
					"reward4":val.rewardB4,
					"region":val.region,
					"region2":val.region2,
					"questSize":questSize,
					"other":val.name,
					"type":"b",
					"attackList":val.attackList
					};
			return false;
			}
	})
	return quest;
}

function getReward(name)
	{
	var rewards = [];
	rewards.nilOdds = jsonParcel[name].nilOdds;
	rewards.totalOdds = 0;
	rewards.items = [];
	$.each(jsonParcel[name].itemList, function(index, val)
		{
		// console.log($.isEmptyObject(val));
		if(!$.isEmptyObject(val))
			{
			var item = "";
			var itemName = "";
			var itemPic = "";
			var itemRarity = "";
			var itemType = "";
			var itemMin = "";
			var itemMax = "";
			var itemCh = "";
			if(val.id[1])
				{
				itemName = jsonEquipments[val.id[1]-1].name;
				itemPic = jsonEquipments[val.id[1]-1].image;
				itemRarity = jsonEquipments[val.id[1]-1].rarity;
				itemType = "trinket";
				}
			else
				{
				itemName = jsonMaterials[val.id[0]-1].name;
				itemPic = jsonMaterials[val.id[0]-1].image;
				itemRarity = jsonMaterials[val.id[0]-1].rarity;
				itemType = "material";
				}
				
			if(val.amount.length > 1)
				{
				itemMin = val.amount[0];
				itemMax = val.amount[val.amount.length-2];
				}
			// else if(val.amount[3])
				// {
				// itemMin = val.amount[0];
				// itemMax = val.amount[2];
				// }
			else
				{
				itemMin = val.amount[0];
				itemMax = val.amount[0];
				}
				
			itemCh = val.odds;
			rewards.totalOdds += val.odds;
			
			item = {
				"name":itemName,
				"image":itemPic,
				"rarity":itemRarity,
				"type":itemType,
				"min":itemMin,
				"max":itemMax,
				"odd":itemCh
				}
			
			// console.log(item);
			rewards.items.push(item);
			}
		});
		
	// console.log(rewards);
	return rewards;
	}

function usedToCraftFromMaterial(id) {
	var crafted = [];
	$.each(jsonEquipments, function(index, val) {
		$.each(val.materialID, function(index, value)
			{
			if(value-1 == id && (val.hasOwnProperty("materialType") && val.materialType[index] != "equipment") || value-1 == id && !val.hasOwnProperty("materialType"))
				{
				var type ="";
				if(val.itemSlot == 1)
					{
					type = "weapon";
					}
				else if(val.itemSlot == 6)
					{
					type = "trinket";
					}
				else
					{
					type = "armor";
					}
				var eq = {name: val.name, image: val.image, rarity: val.rarity, type:type, amount:val.materialAmount[index]};
				crafted.push(eq);
				return false;
				}
			})
	})
	$.each(jsonPotions, function(index, val) {
		$.each(val.materialID, function(index, value)
			{
			if(value-1 == id && (val.hasOwnProperty("materialType") && val.materialType[index] != "consumable") || value-1 == id && !val.hasOwnProperty("materialType"))
				{
				var eq = {name: val.name, image: val.image, rarity: val.rarity, type:"potion", amount:val.materialAmount[index]};
				crafted.push(eq);
				return false;
				}
			})
	})
	$.each(jsonMaterials, function(index, val) {
		$.each(val.materialID, function(index, value)
			{
			if(value-1 == id)
				{
				var eq = {name: val.name, image: val.image, rarity: val.rarity, type:"material", amount:val.materialAmount[index]};
				crafted.push(eq);
				return false;
				}
			})
	})
	return crafted;
}

function usedToCraftFromPotion(id) {
	var crafted = [];
	$.each(jsonPotions, function(index, val) {
		$.each(val.materialID, function(index, value)
			{
			if(val.hasOwnProperty("materialType"))
				{
				if(value-1 == id && val.materialType[index] == "consumable")
					{
					var eq = {name: val.name, image: val.image, rarity: val.rarity, type:"potion", amount:val.materialAmount[index]};
					crafted.push(eq);
					return false;
					}
				}
			})
	})
	return crafted;
	}

function usedToCraftFromEquipment(id) {
	var crafted = [];
	$.each(jsonEquipments, function(index, val) {
		$.each(val.materialID, function(index, value)
			{
			if(val.hasOwnProperty("materialType"))
				{
				if(value-1 == id && val.materialType[index] == "equipment")
					{
					var eq = {name: val.name, image: val.image, rarity: val.rarity, type:"weapon", amount:val.materialAmount[index]};
					crafted.push(eq);
					return false;
					}
				}
			})
	})
	return crafted;
}

function getQuestNamesByRegioName(name) {
	var regio = 0;
	if(name == "Tuvale Forest"){regio = 1}
	else if(name == "Yarsol Cove"){regio = 2}
	else if(name == "Aldur Highlands"){regio = 3}
	else if(name == "Vulkrum Badlands"){regio = 4}
	else if(name == "Grimhal Volcano"){regio = 5}
	else if(name == "Frentir Chasm"){regio = 6}

	var names = [];
	$.each(jsonQuests, function(index, val)
		{
		if(val.region == regio && val.title != "Placeholder")
			{
			names.push(val.name);
			if(val.nameB)
				{
				names.push(val.nameB);
				}
			}
		});
	return names;
}

function getPrefixStatByName(name) {
	var stat = "";
	$.each(jsonPrefixes, function(index, val)
		{
		if(name == val.name)
			{
			stat = {"name":Object.keys(val.stats)[0], "val":val.stats[Object.keys(val.stats)[0]]};
			return false;
			}
		});
	return stat;
}

function trimDate(date) {
	var length = 10;
	var trimmedDate = date.substring(0, length);
	return trimmedDate;
}
