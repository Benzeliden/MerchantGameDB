//Controller for Regions
angular.module('mainApp')
	.controller('regioCtrl', function($scope, $routeParams, regionService) {
		$scope.regioName = $routeParams.id;
		$scope.mats = jsonMaterials;
		$scope.eq = jsonEquipments;
		
		$scope.quests = regionService.getQuestsForRegion($routeParams.id);
	})