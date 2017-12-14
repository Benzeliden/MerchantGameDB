//Controller for main content
angular.module('mainApp')
	.controller('mainCtrl', function ($scope, $routeParams) {
		$scope.name = "Main";
		$scope.params = $routeParams;

		$scope.bosses = jsonBosses;
		$scope.quests = jsonQuests;
		
		var currentTimestamp = Math.floor(Date.now() / 1000);
		for (var i = 0; i < jsonBosses.length; i++) {
			var boss = jsonBosses[i]
			boss.isBoost = boss.resultParams.length > 1
			boss.startTimestamp = boss.detectParams[0]
			boss.duration = boss.detectParams[1]
			boss.endTimestamp = boss.startTimestamp + boss.duration
			if (boss.detectParams[2] !== undefined) {
				var period = Math.floor((currentTimestamp - boss.startTimestamp) / boss.detectParams[2]) * boss.detectParams[2]
				if ((boss.endTimestamp + period) < currentTimestamp) {
					period = period + boss.detectParams[2]
				}
				boss.startTimestamp = boss.startTimestamp + period
				boss.endTimestamp = boss.endTimestamp + period
			}
		}

		jsonBosses.sort(function (a, b) { return a.startTimestamp - b.startTimestamp })
	})