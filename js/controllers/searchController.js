//Controller for the search
angular.module('mainApp')
	.controller('searchController', function ($scope, searchService) {
		$scope.gameObjects = jsonSearch;
		//FOR WHEN A MENU ITEM IS CLICKED
		$scope.itemSelected = function (selected) {
			if (selected) { //Need to know if on a DB page or not
				console.log("selected", selected)
				var URLextender = ""
				var postfix = ""
				if (selected.originalObject.type == "Weapon") { URLextender = "items/weapon/" }
				else if (selected.originalObject.type == "Armor") { URLextender = "items/armor/" }
				else if (selected.originalObject.type == "Trinket") { URLextender = "items/trinket/" }
				else if (selected.originalObject.type == "Material") { URLextender = "items/material/" }
				else if (selected.originalObject.type == "Potion") { URLextender = "items/potion/" }
				else { 
					URLextender = "quests/"
					postfix = "?gid=" + selected.originalObject.gid
				 }

				var objectURL = "#!/" + URLextender + selected.title + postfix;
				$(location).attr('href', objectURL);
				return false;
			} else {
				console.log('cleared');
			}
		};

		$scope.limitedSearch = function (str, items) {
			var matches = searchService.fuseSearch(str).slice(0, 20);

			return matches;
		}
	});