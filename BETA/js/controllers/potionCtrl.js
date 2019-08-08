//Controller for Potions
angular.module('mainApp')
	.controller('potionCtrl', function ($scope, $routeParams) {
		$scope.potion = getPotionByName($routeParams.id);
		$scope.potionID = getPotionIdByName($routeParams.id);
		if ($scope.potion.hasOwnProperty("materialType")) {
			$scope.craftedBy = getMaterialByIdSpec($scope.potion.materialID, $scope.potion.materialAmount, $scope.potion.materialType);
		}
		else {
			$scope.craftedBy = getMaterialById($scope.potion.materialID, $scope.potion.materialAmount);
		}
		$scope.craft = usedToCraftFromPotion($scope.potionID);
		if ($scope.craft.length == 0) { $scope.craft = "" }
		
        $scope.craftTimeMin = jsonGrades["0"].craftTimeMin;
		$scope.craftTimeMax = jsonGrades["0"].craftTimeMax;
		$scope.crafterName = $scope.potion.crafterID == 5 ? "Alchemist" : "Scribe"
	})
