//Controller for itemMaterial
angular.module('mainApp')
	.controller('itemMaterialCtrl', function ($scope, $routeParams, filtersService) {

		$scope.TiersFilter = filtersService.getTiers();
		$scope.SubtypesFilter = filtersService.getMaterialTypes();
		$scope.material = jsonMaterials;

		$scope.showMaterialsByType = function (item) {
			return filtersService.isMatch(item.subType, $scope.SubtypesFilter);
		};

		$scope.showMaterialsByTier = function (item) {
			var tier = item.dbTier;
			return filtersService.isMatch(tier, $scope.TiersFilter);
		};
	})