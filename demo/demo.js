(function() {
	angular.module('demoApp', ['ByGiro.signaturePad']).controller('demoCtrl', [
		'$scope','$window', function($scope, $window) {		
			$scope.mySign = '';
		}
	]);
})();