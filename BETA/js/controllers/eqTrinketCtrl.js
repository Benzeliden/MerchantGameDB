//Controller for Trinkets
angular.module('mainApp')
	.controller('eqTrinketCtrl', function ($scope, $routeParams, itemsService) {
		$scope.Math = Math;
		$scope.item = getEquipmentByName($routeParams.id);
		$scope.itemID = getEquipmentIdByName($routeParams.id);
		$scope.droppedBy = getMonsterByTrinketId($scope.itemID);
		$scope.rarityMod = jsonRarity;

		if ($scope.item.crafterID != 0) { //if its craftable (worn items fix)
			if ($scope.item.hasOwnProperty("materialType")) {
				$scope.material = getMaterialByIdSpec($scope.item.materialID, $scope.item.materialAmount, $scope.item.materialType);
			}
			else {
				$scope.material = getMaterialById($scope.item.materialID, $scope.item.materialAmount);
			}
		}
		$scope.craft = usedToCraftFromEquipment($scope.itemID);

		itemsService.initGradeFromRoute($scope, $routeParams);
		itemsService.initPrefixFromRoute($scope, $routeParams);
		itemsService.initPrestigeLevelFromRoute($scope, $routeParams);
		itemsService.initQuality($scope);
		
		$scope.bonusStats = itemsService.prepareBonusStats($scope)

		//ON SUFFIX/PREFIX/GRADE change
		$scope.suffixPrefixChange = function () {
			var objectURL = "#!/items/trinket/" + $routeParams.id + "?grade=" + $scope.grade + "&prefix=" + $scope.prefix;
			if ($scope.prestigeLevel > 0) {
				objectURL += "&prestigeLevel=" + $scope.prestigeLevel
			}
			$(location).attr('href', objectURL);
		}
	})
