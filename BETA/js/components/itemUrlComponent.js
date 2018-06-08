(function () {
    componentController.$inject = ["popupService"] //need to inject because we wrapped component into (function(){})()
    function componentController(popupService) {
        var self = this;

        self.copyModel = popupService.copyModel;

        self.$onInit = function () {
            self.itemUrl = window.location.href;
            self.redditText = "[" + self.redditName + "]" + " (" + self.itemUrl + ")";
            self.labelText = self.title || "Unique Item URL:";
        }

        self.toogleReddit = function (flag) {
            self.copyModel.showReddit = flag;
        }
    }
    var myComponentDefinition = {
        templateUrl: "templates/item-url-component.html",

        bindings: {
            redditName: '<',
            title: '@'
        },
        controller: componentController,
        controllerAs: 'url'
    }

    angular.module("mainApp").component('itemUrl', myComponentDefinition);
})();