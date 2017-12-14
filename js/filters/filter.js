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

			var time = year + '. ' + month + '. ' + date;
			return time;
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
	.filter('changeStat',function() {
    return function(input)
		{
		if(input == "hpBns"){input = "HP";}
		else if(input == "atkBns"){input = "Atk";}
		else if(input == "atkPct"){input = "Atk%";}
		else if(input == "matkBns"){input = "mAtk";}
		else if(input == "matkPct"){input = "mAtk%";}
		else if(input == "defBns"){input = "Def";}
		else if(input == "defPct"){input = "Def%";}
		else if(input == "mdefBns"){input = "mDef";}
		else if(input == "mdefPct"){input = "mDef%";}
		else if(input == "accBns"){input = "Acc";}
		else if(input == "accPct"){input = "Acc%";}
		else if(input == "critBns"){input = "Crit";}
		else if(input == "str"){input = "Str";}
		else if(input == "dex"){input = "Dex";}
		else if(input == "int"){input = "Int";}
		else if(input == "lckMod"){input = "Luck";}
		else if(input == "gldMod"){input = "Gold";}
		else if(input == "expMod"){input = "Exp";}
		else if(input == "critMod"){input = "Crit%";}
		else if(input == "apMod"){input = "AP";}
		return input;
		}
	})
	.filter('grade', function($filter){
		var numberFilter = $filter('number');
		return function(input, gradeMultiplier){
			var result;
			if (input < 0){
				result = input / gradeMultiplier; //negative stats handling
			}else if (input < 1){
				result = input * 100; // percent stats handling
			}else{
				result = input * gradeMultiplier
			}
			return numberFilter(Math.ceil(result), 0);
		}
	})
	//filter fix % stats displaying
	.filter('fixPercentStat', function(){
		var percentStats = ["atkPct","matkPct","defPct", "mdefPct", "accPct"];

		return function(input, statName) {
			return percentStats.indexOf(statName) === -1 ? input : input * 100;
		}
	});