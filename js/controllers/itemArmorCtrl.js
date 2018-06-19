//Controller for itemArmor
angular.module('mainApp')
	.controller('itemArmorCtrl', function ($scope, $routeParams, filtersService) {

		$scope.equipment = jsonEquipments;
		$scope.formula = jsonFormulas;
		$scope.TiersFilter = filtersService.getTiers();
		$scope.ArmorsmithFilter = filtersService.getArmorsmithTypes();
		$scope.ClothWorkerFilter = filtersService.getClothWorkerTypes();
		$scope.StatsFilter = filtersService.getStatsFilter();
		$scope.ignoreStatsFilter = true

		function itemSlot(item) {
			return item.itemSlot == 2 ||
				item.itemSlot == 3 ||
				item.itemSlot == 4 ||
				item.itemSlot == 5;
		};

		function showArmorsByType(item) {
			return filtersService.isMatch(item.subType, $scope.ArmorsmithFilter)
				|| filtersService.isMatch(item.subType, $scope.ClothWorkerFilter);
		};

		function showArmorsByTier(item) {
			return filtersService.isMatch(item.dbTier, $scope.TiersFilter);
		};

		function showArmorsByStat(item) {
			return $scope.ignoreStatsFilter
				|| filtersService.filterStats(item.bonusStat, $scope.StatsFilter)
		}

		$scope.setStatsFilter = function (countSelected, isAllSelected) {
			$scope.ignoreStatsFilter = countSelected == 0 || isAllSelected
		}

		$scope.finalFilter = function (item) {
			return itemSlot(item) && showArmorsByType(item) && showArmorsByTier(item) && showArmorsByStat(item)
		}
	})