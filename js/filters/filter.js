angular.module('mainApp')

	//filter change space ( ) to underscore (_)
	.filter('spaceless',function() {
    return function(input) {
        if (input) {
            return input.replace(/\s+/g, '_');
        }
    }
	})
	
	//filter change timestamp to yyyy-mm-dd
	.filter('timestampToDate',function() {
    	return function(input) {
			function n(n){
					return n > 9 ? "" + n: "0" + n;
			}
			var a = new Date(input * 1000);
			
			var year = a.getFullYear();
			var month = n(a.getMonth()+1);
			var date = n(a.getDate());
			var hours = n(a.getHours());
			var minutes = n(a.getMinutes());

			var time = year + '.' + month + '.' + date + ' ' + hours + ':' + minutes;
			return time;
    	}
	})

	.filter('duration', function(){
		function getReadableDuration(duration) {
			var minutes = Math.floor(duration / 60);
			var result;
			if (duration < 600) { //less than 10 minutes
				result = minutes + "m ";
				var seconds = Math.floor(duration % 60);
				if (seconds > 0) {
					result += " " + seconds + "s";
				}
			} else if (duration < 600 * 60) {//less than 10 hours				
				result = "~" + Math.floor(minutes / 60) + "h";
				minutes = minutes % 60;
				if (minutes > 0) {
					result += " " + minutes + "m";
				}
			} else {//more than 10 hours
				result = "~" + Math.round(minutes / 60) + "h";
			}
			return result;
		}

		return function (input, craftTimeMin, craftTimeMax) {
			var result;
			if (craftTimeMax == craftTimeMin) {
				result = getReadableDuration(input * craftTimeMin);
			} else {
				result = getReadableDuration(input * craftTimeMin) +
					" - " + getReadableDuration(input * craftTimeMax);
			}

			return result;
		}
	})

	.filter('durationToDays', function(){
		return function(input) {
			var days = Math.round(input / 60 / 60 / 24);
			var word;
			if (days % 10 == 1) {
				word = " day";
			} else{
				word = " days";
			}

			return days + word;
		}
	})
	
	//filter gives back 0 if given timestamp is in the past, 1 if in the future
	.filter('curTimestamp',function() {
    return function(input) {
			var current = Math.floor(Date.now() / 1000);
			if(current > input)
				{
				return 0;
				}
			else
				{
				return 1
				}
    }
	})

	//filter normalize stat
	.filter('changeStat',function(filtersService) {
		var statsMap = filtersService.statsNames
		return function(input)	{
			if (statsMap[input] != undefined){
				return statsMap[input]
			}
			return input;
		}
	})
	.filter('grade', function($filter, itemsService){
		var numberFilter = $filter('number');
		return function(input, gradeMultiplier){
			var result = itemsService.getStatAfterGrade(input, gradeMultiplier)
			return numberFilter(result, 0);
		}
	})
	//filter fix % stats displaying
	.filter('fixPercentStat', function(){
		var percentStats = ["atkPct","matkPct","defPct", "mdefPct", "accPct", "hpPct", "critMod"];

		return function(input, statName) {
			return percentStats.indexOf(statName) === -1 ? input : input * 100;
		}
	})
	.filter('imageToCssClass', function () {
		var mapping = {
			"Armor/": "ico-item",
			"Materials/": "ico-item",
			"Weapons/": "ico-item",
			"Consumables/": "ico-item",
			"Quests/": "ico-quest",
			"Skills/": "ico-skill",
		};
		var icoTypes = [];
		for (var i in mapping){
			if (mapping.hasOwnProperty(i)){
				icoTypes.push(i);
			}
		}
		return function (input, cssClass) {
			if (cssClass == undefined) {
				var icoType;
				//todo: handle undefined images?
				for (var i = 0;i<icoTypes.length;i++){
					icoType = icoTypes[i]; 
					if (input.indexOf(icoType) === 0){
						break;
					}
					icoType = null
				}
				console.log("test input", input, icoType)
	
				if (icoType == null) {
					icoType = "Quests/"
					input = icoType + input
				}
	
				cssClass = mapping[icoType];

				input = input.replace(icoType, cssClass + "-")
			}else{
				input = cssClass + "-" + input
			}

			var res = cssClass + " " + input.replace("/", "-").replace(" ", "-").replace(".png", "");
			return res;
		}
	})
	;