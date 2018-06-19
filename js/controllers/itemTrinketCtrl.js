//Controller for itemTrinket
angular.module('mainApp')
	.controller('itemTrinketCtrl', function ($scope, $routeParams, filtersService) {
		$scope.equipment = jsonEquipments;
		$scope.TiersFilter = filtersService.getTiers();
		$scope.TypesFilter = filtersService.getTrinketsTypes();
		$scope.StatsFilter = filtersService.getStatsFilter();
		$scope.ignoreStatsFilter = true

		function showTrinketsByTier(item) {
			return filtersService.isMatch(item.dbTier, $scope.TiersFilter);
		};
		function showTrinketsByType(item) {
			return filtersService.isMatch(item.subType, $scope.TypesFilter);
		};

		function showTrinketByStat(item) {
			return $scope.ignoreStatsFilter
				|| filtersService.filterStats(item.bonusStat, $scope.StatsFilter)
		}

		$scope.finalFilter = function (item) {
			return item.itemSlot == 6 &&
				showTrinketsByTier(item) && showTrinketsByType(item) && showTrinketByStat(item)
		}

		$scope.setStatsFilter = function (countSelected, isAllSelected) {
			$scope.ignoreStatsFilter = countSelected == 0 || isAllSelected
		}
	})