$(document).ready(function()
	{
		$("#main-content").on("click", ".copy-item-url", function() {
			fadeInBlackBG();
			fadeInUrlBox();
		})

		$("#main-content").on("click", ".comparison-copy-item-url", function() {
			fadeInBlackBG();
			fadeInUrlBox();
		})

		//Compare button click handler
		$("#main-content").on("click", ".eqpage-compare-button", function() {

			//If there is no item in comparison table
			if ($("#item1-compare").text().length == 0) {
				//Call function that displays single item in prompt
				displayFirstCompareItem();
				fadeInBlackBG();
				fadeInComparePrompt();
				if (!$("#comparison-prompt-second-row").hasClass("hide")) {
					$("#comparison-prompt-second-row").addClass("hide");
				}
			}
			//Else if there is an item in the comparison table
			else if ($("#item1-compare").text().length > 0) {
				//If conflicting item types
				if ($("#primary-type").text() != $("#item1-type").text()) {
					console.log("these types don't match!")
					var comparisonError = true;
					displayBothCompareItems(comparisonError);
					fadeInBlackBG();
					fadeInComparePrompt();
				}
				else {
					//Call function that displays prompt for 2 items
					displayBothCompareItems();
					fadeInBlackBG();
					fadeInComparePrompt();
				}
			}

		})
	});

//show comments
$(document).on("click", "#commentsButton", function(){
		$("#comments").show();
		resetDisqus();
		$("#commentsButton").hide();
	});

//Copy standard page link button
$(document).on("click", ".copy-standard-link-button", function() {
		console.log("check");
		fadeOutBlackBG();
		fadeOutUrlBox();

		$("#generatedLink").show();
		$("#generatedLink-reddit").addClass("hide");

		var copyTextarea = document.querySelector('#generatedLink');
		copyTextarea.select();

		try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
      $("#copy-message").css("display", "block").append("Copied to clipboard!");
    } catch (err) {
      console.log('Oops, unable to copy');
      $("#copy-message").css("display", "block").append("Oops! Unable to copy.");
    }
	})

//Copy reddit page link button
$(document).on("click", ".copy-reddit-link-button", function() {
		console.log("check");
		fadeOutBlackBG();
		fadeOutUrlBox();

		$("#generatedLink").hide();
		$("#generatedLink-reddit").removeClass("hide");

		var copyTextarea = document.querySelector('#generatedLink-reddit');
		copyTextarea.select();

		try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
      $("#copy-message").css("display", "block").append("Copied to clipboard!");
    } catch (err) {
      console.log('Oops, unable to copy');
      $("#copy-message").css("display", "block").append("Oops! Unable to copy.");
    }
	})

//Close urls popup on X button click
$(document).on("click", ".url-box-close-button", function() {
		fadeOutBlackBG();
		fadeOutUrlBox();
	})

//Close comparison prompt on X button click
$(document).on("click", ".prompt-close-button", function() {
		fadeOutBlackBG();
		fadeOutComparePrompt();
	})

function displayFirstCompareItem() {
		//Set item 1's name and icon
		var item1Name 	= $(".item-name").text();
		var item1Icon 	= "<img src="+$(".object-image img").attr('src')+">";
		var item1Prefix =	$("#prefix-hold").text();
		var item1Suffix = $("#suffix-alone").text();
		var item1Type		= $("#primary-type").text();

		//Transfer gear name to the temp-comparison div with a space to separate
		//This is so that the comparison page can get the items needed to compare
		$("#item1-compare").text(item1Name + " ");
		$("#item1-type").text(item1Type);
		$("#item1-prefix").text(item1Prefix);
		$("#item1-suffix").text(item1Suffix);

		//Update the prompt
		$("#comparison-error-hold").addClass("hide");
		$("#comparison-prompt h3").text("Item Comparison");
		$("#comparison-prompt p").text(item1Name + " added to comparsion table.");
		$("#comparison-prompt-item1-icon").html(item1Icon);
		$("#comparison-prompt-item1-name").text(item1Prefix + " " + item1Name + " +" + item1Suffix);
		$("#comparison-prompt-remove1").html("<span class='glyphicon glyphicon-remove'></span>");

		//Remove item1 "X" click handler
		$(document).on("click", "#comparison-prompt-remove1", function() {
			//Reset item1 variables
			$("#item1-compare").empty();
			$("#item1-prefix").empty();
			$("#item1-suffix").empty();
			$("#item1-type").empty();
			item1Name = "";
			item1Icon = "";
			item1Prefix = "";
			item1Suffix = "";
			$("#comparison-prompt-item1-icon").text("");
			$("#comparison-prompt-item1-name").text(" Item Removed");
			$("#comparison-prompt-remove1").text("");
		})
	}

function displayBothCompareItems(hasError) {
		//Set item 2's name and icon
		var item2Name = $(".item-name").text();
		var item2Icon = "<img src="+$(".object-image img").attr('src')+">";
		var item2Prefix =	$("#prefix-hold").text();
		var item2Suffix = $("#suffix-alone").text();

		//If item types do not match
		if (hasError == true) {
			//Update the prompt
			$("#comparison-error-hold").removeClass("hide");
			$("#comparison-prompt h3").text("Item Comparison");
			$("#comparison-prompt p").text("Did not add " + item2Name + " to comparsion table.");
		}
		else {
			//Transfer gear name to the temp-comparison di
			//This is so that the comparison page can get the items needed to compare
			$("#item2-compare").text(item2Name);
			$("#item2-prefix").text(item2Prefix);
			$("#item2-suffix").text(item2Suffix);

			//Update the prompt
			$("#comparison-error-hold").addClass("hide");
			$("#comparison-prompt-second-row").removeClass("hide");
			$("#comparison-prompt h3").text("Item Comparison");
			$("#comparison-prompt p").text(item2Name + " added to comparsion table.");
			$("#comparison-prompt-item2-icon").html(item2Icon);
			$("#comparison-prompt-item2-name").text(item2Prefix + " " + item2Name + " +" + item2Suffix);
			$("#comparison-prompt-remove2").html("<span class='glyphicon glyphicon-remove'></span>");

			//Switch buttons
			$("#comparison-prompt-confirm-button").addClass("hide");
			$("#comparison-prompt-final-button").removeClass("hide");

			//Remove item1 "X" click handler
			$(document).on("click", "#comparison-prompt-remove1", function() {
				//Transfer item2 info over to item1
				$("#item1-compare").text(item2Name);
				$("#item1-prefix").text(item2Prefix);
				$("#item1-suffix").text(item2Suffix);
				var item1Type	= $("#primary-type").text();
				$("#item1-type").text(item1Type);
				item1Name = item2Name;
				item1Icon = item2Icon;
				item1Prefix = item2Prefix;
				item1Suffix = item2Suffix;
				$("#comparison-prompt-item1-icon").html(item1Icon);
				$("#comparison-prompt-item1-name").text(item1Prefix + " " + item1Name + " +" + item1Suffix);
				$("#comparison-prompt-remove1").html("<span class='glyphicon glyphicon-remove'></span>");

				//Reset item2 fields and variables
				$("#item2-compare").empty();
				$("#item2-prefix").empty();
				$("#item2-suffix").empty();
				item2Name = "";
				item2Icon = "";
				item2Prefix = "";
				item2Suffix = "";
				$("#comparison-prompt-item2-icon").text("");
				$("#comparison-prompt-item2-name").text(" Item Removed");
				$("#comparison-prompt-remove2").text("");

				//Hide second row
				$("#comparison-prompt-second-row").addClass("hide");

				//Switch buttons
				$("#comparison-prompt-confirm-button").removeClass("hide");
				$("#comparison-prompt-final-button").addClass("hide");
			})

			//Remove item2 "X" click handler
			$(document).on("click", "#comparison-prompt-remove2", function() {
				//Reset item2 variables
				$("#item2-compare").empty();
				$("#item2-prefix").empty();
				$("#item2-suffix").empty();
				item2Name = "";
				item2Icon = "";
				item2Prefix = "";
				item2Suffix = "";
				$("#comparison-prompt-item2-icon").text("");
				$("#comparison-prompt-item2-name").text(" Item Removed");
				$("#comparison-prompt-remove2").text("");

				//Hide second row
				$("#comparison-prompt-second-row").addClass("hide");

				//Switch buttons
				$("#comparison-prompt-confirm-button").removeClass("hide");
				$("#comparison-prompt-final-button").addClass("hide");
			})

			//"View Comparison" button click handler
			$("#comparison-prompt-final-button").unbind().click(function() {

				//Get items from DOM
				var item1ID					= $("#item1-compare").text();
				var item1PrefixID		= $("#item1-prefix").text();
				var item1SuffixID		= $("#item1-suffix").text();
				var item2ID					= $("#item2-compare").text();
				var item2PrefixID		= $("#item2-prefix").text();
				var item2SuffixID		= $("#item2-suffix").text();

				//Convert item names, suffix, and prefix to IDs
				item1ID = getEquipmentIdByName($.trim(item1ID));
				item1PrefixID = getPrefixIdByName($.trim(item1PrefixID));

				item2ID = getEquipmentIdByName($.trim(item2ID));
				item2PrefixID = getPrefixIdByName($.trim(item2PrefixID));



				//Reset all comparison related html fields
				$("#item1-compare").empty();
				$("#item1-prefix").empty();
				$("#item1-suffix").empty();
				$("#item1-type").empty();
				$("#item2-compare").empty();
				$("#item2-prefix").empty();
				$("#item2-suffix").empty();

				$("#comparison-prompt-confirm-button").removeClass("hide");
				$("#comparison-prompt-final-button").addClass("hide");



				//Go to URL passing in the ID numbers as link params
				var comparisonURL = "#!/tools/compare?c=" + item1ID + "," + item1PrefixID + "," + item1SuffixID + ",0-" + item2ID + "," + item2PrefixID + "," + item2SuffixID+",0";
				$(location).attr('href', comparisonURL);



				//Close prompt
				fadeOutComparePrompt();
				fadeOutBlackBG();
			})

		}//End if/else
	}

//Close urls popup on X button click
$(document).on("click", "#comparison-prompt-confirm-button", function() {
		fadeOutBlackBG();
		fadeOutComparePrompt();
	})

function fadeInBlackBG() {
		//Fade background to black
		$("#black-overlay").removeClass("hide");
	}

function fadeOutBlackBG() {
		//Fade out background to black
		$("#black-overlay").addClass("hide");
	}

function fadeInUrlBox() {
		//Fade in URL-BOX
		$("#urls-popup").removeClass("hide");
	}

function fadeOutUrlBox() {
		//Fade out URL-BOX
		$("#urls-popup").addClass("hide");
	}

function fadeInComparePrompt() {
		$("#comparison-prompt").removeClass("hide");
	}

function fadeOutComparePrompt() {
		$("#comparison-prompt").addClass("hide");
	}

function lvToTier(lv) {
	return Math.floor(((lv-0.1)/10)+1);
}

function lvToTierAtPotion(lv) {
	return Math.floor(((lv)/10)+1);
}

function lvToTierAtMaterials(lv) {
	return Math.floor(((lv)/10)+1);
}

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
				var monsterInfo = {name: val.nameB, region: val.region, icon: val.imageB, rarity: val.titleB, dropRate: val.trinketB[1]};
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
					var monster = {name: val.nameB, rarity: val.titleB, icon: val.imageB, oddsMin: listDrops[indexOf].oddsMin, oddsMax: listDrops[indexOf].oddsMax, min: listDrops[indexOf].min, max: listDrops[indexOf].max,region: regionById(val.region)}
					monsters.push(monster)
					}		
				indexOf = listDropsName.indexOf(val.rewardB4)
				if(indexOf > -1)
					{
					var monster = {name: val.nameB, rarity: val.titleB, icon: val.imageB, oddsMin: listDrops[indexOf].oddsMin, oddsMax: listDrops[indexOf].oddsMax, min: listDrops[indexOf].min, max: listDrops[indexOf].max,region: regionById(val.region)}
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

function getMonsterByMaterialId(id) {
	var monsters = [];
	var listDrops = [];
	var listDropsName = [];

	$.each(jsonParcel, function(i, val) {
		var totalOdds = 0;
		var min = "";
		var max = "";
		var odds = "";
		$.each(val.itemList, function(j, val2) {
			totalOdds += val2.odds;
			if(val2.id-1 == id)
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
			if (val.rewardA1[0]-1 == id) {
				var monster = {name: val.name, rarity: val.title, icon: val.image, oddsMin: 100, oddsMax: 100, min: val.rewardA1[1], max: val.rewardA1[2],region: regionById(val.region)}
				monsters.push(monster)
			}
			else if (val.rewardA2[0]-1 == id) {
				var monster = {name: val.name, rarity: val.title, icon: val.image, oddsMin: 100, oddsMax: 100, min: val.rewardA2[1], max: val.rewardA2[2],region: regionById(val.region)}
				monsters.push(monster)
			}
			
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
				if (val.rewardB1[0]-1 == id) {
					var monster = {name: val.nameB, rarity: val.titleB, icon: val.imageB, oddsMin: 100, oddsMax: 100, min: val.rewardB1[1], max: val.rewardB1[2],region: regionById(val.region)}
					monsters.push(monster)
				}
				else if (val.rewardB2[0]-1 == id) {
					var monster = {name: val.nameB, rarity: val.titleB, icon: val.imageB, oddsMin: 100, oddsMax: 100, min: val.rewardB2[1], max: val.rewardB2[2],region: regionById(val.region)}
					monsters.push(monster)
				}
				
				indexOf = listDropsName.indexOf(val.rewardB3)
				if(indexOf > -1)
					{
					var monster = {name: val.nameB, rarity: val.titleB, icon: val.imageB, oddsMin: listDrops[indexOf].oddsMin, oddsMax: listDrops[indexOf].oddsMax, min: listDrops[indexOf].min, max: listDrops[indexOf].max,region: regionById(val.region)}
					monsters.push(monster)
					}		
				indexOf = listDropsName.indexOf(val.rewardB4)
				if(indexOf > -1)
					{
					var monster = {name: val.nameB, rarity: val.titleB, icon: val.imageB, oddsMin: listDrops[indexOf].oddsMin, oddsMax: listDrops[indexOf].oddsMax, min: listDrops[indexOf].min, max: listDrops[indexOf].max,region: regionById(val.region)}
					monsters.push(monster)
					}	
				}
			}
	})
	return monsters;
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
					"image":val.imageB,
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
					"attackList":val.attackListB
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

function getGuideByTitle(title) {
	 var guide = "";
	 $.each(listOfGuides, function(index, val) {
		 if (listOfGuides[index].title.rendered == title) {
				guide = val;
				return false;
			}
	 })
	return guide;
}

function getAuthorByID(id) {
	var author = "";
	if (id == 1) {
		author = "Chirp";
	}
	else if (id == 2) {
		author = "Phaturia";
	}
	else if (id == 3) {
		author = "EnzymSama";
	}
	else if (id == 4) {
		author = "Kamighty";
	}
	else if (id == 5) {
		author = "Rkinasz";
	}
	return author;
}

function trimDate(date) {
	var length = 10;
	var trimmedDate = date.substring(0, length);
	return trimmedDate;
}
