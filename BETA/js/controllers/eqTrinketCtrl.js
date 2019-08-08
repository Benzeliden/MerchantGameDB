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

		itemsService.initFromRoute($scope, $routeParams);
		
		$scope.bonusStats = itemsService.prepareBonusStats($scope)

		//ON SUFFIX/PREFIX/GRADE change
		$scope.suffixPrefixChange = function () {
			var objectURL = itemsService.constructUrl($scope, "#!/items/trinket/" + $routeParams.id)
			$(location).attr('href', objectURL);
		}
	})
