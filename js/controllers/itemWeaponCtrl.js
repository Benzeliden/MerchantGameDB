angular.module('mainApp')
	.controller('itemWeaponCtrl', function ($scope, $routeParams, filtersService) {

		$scope.equipment = jsonEquipments;
		$scope.formula = jsonFormulas;
		$scope.TiersFilter = filtersService.getTiers();
		$scope.BlacksmithFilter = filtersService.getBlacksmithTypes();
		$scope.WoodworkerFilter = filtersService.getWoodworkerTypes();
		$scope.SpecialFilter = filtersService.getSpecialTypes();
		$scope.StatsFilter = filtersService.getStatsFilter();
		$scope.ignoreStatsFilter = true

		//Filter by Type
		function showWeaponsByType(item) {
			return filtersService.isMatch(item.subType, $scope.BlacksmithFilter)
				|| filtersService.isMatch(item.subType, $scope.WoodworkerFilter)
				|| filtersService.isMatch(item.subType, $scope.SpecialFilter);
		};

		function showWeaponsByTier(item) {
			return filtersService.isMatch(item.dbTier, $scope.TiersFilter);
		};

		function showWeaponByStat(item) {
			return $scope.ignoreStatsFilter
				|| filtersService.filterStats(item.bonusStat, $scope.StatsFilter)
		}

		$scope.finalFilter = function (item) {
			return item.itemSlot == 1 &&
				showWeaponsByType(item) && showWeaponsByTier(item) && showWeaponByStat(item)
		}

		$scope.setStatsFilter = function (countSelected, isAllSelected) {
			$scope.ignoreStatsFilter = countSelected == 0 || isAllSelected
		}
	});
