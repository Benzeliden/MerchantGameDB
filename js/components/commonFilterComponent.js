(function () {
    function componentController() {
        var self = this;
        self.isAllSelected = false;
        self.idPrefix = "f-" + Math.floor((1 + Math.random()) * 1e7) + "-";

        self.selectAll = function () {
            self.isAllSelected = !self.isAllSelected;
            for (var i = 0; i < self.total; i++) {
                var key = self.optionsArr[i]
                self.options[key].selected = self.isAllSelected;
            }

            self.currentlyChecked = self.isAllSelected ? self.total : 0;
            self.triggerFilterChanged()
        }

        self.optionsArr = []
        for (var key in self.options) {
            if (self.options.hasOwnProperty(key)) {
                self.optionsArr.push(key)
            }
        }
        self.total = self.optionsArr.length;
        self.currentlyChecked = 0;

        self.getId = function (key) {
            return self.idPrefix + key.replace(/[^\w]/g, "_")
        }

        self.needBreak = function (index, last) {
            return self.breakCount && index != last && (index + 1) % self.breakCount == 0
        }

        self.filterChanged = function (key) {
            if (self.options[key].selected) {
                self.currentlyChecked++;
            } else {
                self.currentlyChecked--;
            }
            self.isAllSelected = self.currentlyChecked == self.total
            self.triggerFilterChanged()
        }

        self.triggerFilterChanged = function () {
            if (self.onFilterChanged) {
                self.onFilterChanged({
                    $isAllSelected: self.isAllSelected,
                    $countSelected: self.currentlyChecked
                })
            }
        }
    }
    var myComponentDefinition = {
        templateUrl: "templates/common-filter-component.html",

        bindings: {
            options: '<',
            title: '@',
            cssClass: '@',
            breakCount: '<',
            onFilterChanged: '&'
        },
        controller: componentController,
        controllerAs: 'Filter'
    }

    angular.module("mainApp").component('commonFilter', myComponentDefinition)
})();