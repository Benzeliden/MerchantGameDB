//Controller for Quests
angular.module('mainApp')
	.controller('questCtrl', function ($scope, $routeParams, questService, regionService) {
		$scope.Math = Math
		$scope.quest = regionService.getQuestByName($routeParams.id, $routeParams.gid);
		$scope.mats = jsonMaterials;
		$scope.eq = jsonEquipments;
		$scope.jsonAbility = jsonAbility;
		$scope.rarityMod = jsonRarity;

		if ($scope.quest.reward3) {
			$scope.reward3 = getReward($scope.quest.reward3);
		}

		if ($scope.quest.reward4) {
			$scope.reward4 = getReward($scope.quest.reward4);
		}

		$scope.listOfGrades = jsonGrades;
		
		questService.setupQuestScope($scope)

		$scope.gradeLuckChange = function () {
			questService.setValues($scope.grade, $scope.luck)
			questService.setupQuestScope($scope)
		}
	})
