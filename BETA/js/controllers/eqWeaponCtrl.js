//Controller for Weapons
angular.module('mainApp')
	.controller('eqWeaponCtrl', function($scope, $routeParams, itemsService) {
		$scope.Math = Math;
		$scope.itemID = getEquipmentIdByName($routeParams.id);
		$scope.item = jsonEquipments[$scope.itemID];
		$scope.itemBaseStat = getBaseStatByType($scope.item.subType);
		$scope.rarityMod = jsonRarity;

		if($scope.item.crafterID != 0) { //if its craftable (worn items fix)
			if($scope.item.hasOwnProperty("materialType")) {
				$scope.material = getMaterialByIdSpec($scope.item.materialID, $scope.item.materialAmount, $scope.item.materialType);
			}
			else {
				$scope.material = getMaterialById($scope.item.materialID, $scope.item.materialAmount);
			}
		}
		$scope.craft = usedToCraftFromEquipment($scope.itemID);

		itemsService.initFromRoute($scope, $routeParams);

		$scope.itemAtk = itemsService.getBaseStat($scope, "atk")
		$scope.itemMatk = itemsService.getBaseStat($scope, "matk")
		$scope.itemAcc = itemsService.getBaseStat($scope, "acc")
		$scope.bonusStats = itemsService.prepareBonusStats($scope)
		
		//ON SUFFIX/PREFIX/GRADE change
		$scope.suffixPrefixChange = function() {
			var objectURL = itemsService.constructUrl($scope, "#!/items/weapon/" + $routeParams.id)
			$(location).attr('href', objectURL);
		}
	})
