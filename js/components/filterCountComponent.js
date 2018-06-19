(function () {
    function componentController() {
        var self = this;

        self.$onInit = function () {
            self.itemUrl = window.location.href;
            self.redditText = "[" + self.redditName + "]" + " (" + self.itemUrl + ")";
            self.labelText = self.title || "Unique Item URL:";
        }

    }
    var myComponentDefinition = {
        templateUrl: "/templates/filter-count-component.html",

        bindings: {
            numberOfItems: '<',
            numberAfterFilter: '<'
        },
        controller: componentController,
        controllerAs: 'ctrl'
    }

    angular.module("mainApp").component('filterCount', myComponentDefinition);
})();