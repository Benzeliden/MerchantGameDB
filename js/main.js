'use strict';

/*
Initialize mainApp
mainApp is Bootstrapped to the <html> tag in index.html
*/
var mainApp = angular.module('mainApp', ['snap', 'angucomplete-alt', 'ngRoute', 'ngSanitize'])

// Configuration for $locationProvider
.config(function($locationProvider) {
  // Need comment explaining what this does
	$locationProvider
	  .html5Mode(false)
	  .hashPrefix('!');
	// configure html5 to get links working on jsfiddle
	// $locationProvider.html5Mode(true);
})
//disable debug attributes and html comments
.config(['$compileProvider', function ($compileProvider) {
	$compileProvider.debugInfoEnabled(false);
  }])
// Configuration for mobile "Snap" menu
.config(function(snapRemoteProvider) {
  snapRemoteProvider.globalOptions.disable = 'left';
  snapRemoteProvider.globalOptions.touchToDrag = false;
})

// Routes configuration (using ngRoute)
.config(function($routeProvider) {
	$routeProvider

  /*
  When any part of the URL after the "#!" changes,
  use the following logic to determine which
  HTML template to load, and which controller to use.
  */

    // Routes for individual item pages(weapons, armor, trinkets, mats, potions)
		.when('/items/weapon/:id', {
			templateUrl: 'pages/eqWeapon.html',
			controller: 'eqWeaponCtrl'
		})
		.when('/items/armor/:id', {
			templateUrl: 'pages/eqArmor.html',
			controller: 'eqArmorCtrl'
		})
		.when('/items/trinket/:id', {
			templateUrl: 'pages/eqTrinket.html',
			controller: 'eqTrinketCtrl'
		})
		.when('/items/material/:id', {
			templateUrl: 'pages/materials.html',
			controller: 'materialCtrl'
		})
		.when('/items/consumable/:id', {
			templateUrl: 'pages/potions.html',
			controller: 'potionCtrl'
		})

    // Routes for items selection pages(weapons, armor, trinkets, mats, potions)
		.when('/items/weapons', {
			templateUrl: 'pages/itemWeapon.html',
			controller: 'itemWeaponCtrl'
		})
		.when('/items/armors', {
			templateUrl: 'pages/itemArmor.html',
			controller: 'itemArmorCtrl'
		})
		.when('/items/trinkets', {
			templateUrl: 'pages/itemTrinket.html',
			controller: 'itemTrinketCtrl'
		})
		.when('/items/consumables', {
			templateUrl: 'pages/itemPotion.html',
			controller: 'itemPotionCtrl'
		})
		.when('/items/materials', {
			templateUrl: 'pages/itemMaterial.html',
			controller: 'itemMaterialCtrl'
		})

	// Route for hero pages
	.when('/heroes/:id', {
		templateUrl: 'pages/heroes.html',
		controller: 'heroCtrl'
	})

	// Route for quest pages
	.when('/quests/:id', {
		templateUrl: 'pages/quests.html',
		controller: 'questCtrl'
	})

	// Route for region pages
	.when('/regios/:id', {
		templateUrl: 'pages/regios.html',
		controller: 'regioCtrl'
	})

	// Route for the tool page
	.when('/tools', {
		templateUrl: 'pages/tools.html',
		controller: 'toolCtrl'
	})
		// Route for item comparison page
		.when('/tools/compare', {
			templateUrl: 'pages/toolCompare.html',
			controller: 'toolCompareCtrl'
		})
    // Route for item comparison help page
		.when('/tools/comparison-help', {
			templateUrl: 'pages/comparison-help.html',
			controller: 'toolCtrl'
		})

	// Route for ANY other option not covered above
  // Directs back to home page
	.when('/', {
		templateUrl: 'main.html',
		controller: 'mainCtrl'
	})
	.otherwise({
		redirectTo: '/'
	});
})

.run(['$rootScope', '$route', function($rootScope, $route) {
	$rootScope.$on('$routeChangeSuccess', function() {
		/** CHANGE TITLE ON ROUTE CHANGE **/
		//get the URL, split by /
		var href = window.location.href.split("/");
		//get the text after last /, replace %20 with space and %27 with '
		href = href[href.length-1].replace(/%20/g, " ").replace(/%27/g, "'");
		//if we are on main site
		if(href.length == 0){href = "Main"}
		//attributums after ?
		var baseName = href.split("?")[0];
		var params = href.split("?")[1];
		var suffix = "";
		var prefix = "";
		if(params)
			{
			params = params.split("&");
			$.each(params, function(index, param)
				{
				param = param.split("=")
				if(param[0] == "prefix"){prefix = jsonPrefixes[param[1] || "0"].name}
				else if(param[0] == "suffix"){suffix = jsonSuffixes[param[1] || "0"].name}
				});
			}

		//change title
		document.title = prefix + " " + baseName + " " +suffix + " - MerchantDB"
		window.scrollTo(0, 0);
	});
}]);
