//Controller for Armors
angular.module('mainApp')
	.controller('eqArmorCtrl', function ($scope, $routeParams, itemsService) {
		$scope.Math = Math;
		$scope.itemID = getEquipmentIdByName($routeParams.id);
		$scope.item = jsonEquipments[$scope.itemID];
		$scope.itemBaseStat = getBaseStatByType($scope.item.subType);
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
		itemsService.initSuffixFromRoute($scope, $routeParams);
		itemsService.initPrefixFromRoute($scope, $routeParams);
		itemsService.initPrestigeLevelFromRoute($scope, $routeParams);
		itemsService.initQuality($scope);

		$scope.itemDef = itemsService.getBaseStat($scope, "def")
		$scope.itemMdef = itemsService.getBaseStat($scope, "mdef")
		$scope.bonusStats = itemsService.prepareBonusStats($scope)

		//ON SUFFIX/PREFIX/GRADE change
		$scope.suffixPrefixChange = function () {
			var objectURL = "#!/items/armor/" + $routeParams.id + "?suffix=" + $scope.suffix + "&prefix=" + $scope.prefix + "&grade=" + $scope.grade;
			if ($scope.prestigeLevel > 0) {
				objectURL += "&prestigeLevel=" + $scope.prestigeLevel
			}
			$(location).attr('href', objectURL);
		}
	})
