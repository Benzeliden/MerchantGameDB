// Controller for the <body>
// Used for anything outside of the control of other controllers
angular.module('mainApp')
	.controller('bodyCtrl', function($scope) {
		// Game Version Numbers
		$scope.betaVersion = "3.015";
		$scope.liveVersion = "3.02";
	})
