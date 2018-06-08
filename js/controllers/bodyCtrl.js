// Controller for the <body>
// Used for anything outside of the control of other controllers
angular.module('mainApp')
	.controller('bodyCtrl', function($scope) {
		// Game Version Numbers
		$scope.betaVersion = "2.461";
		$scope.liveVersion = "2.47";
	})
