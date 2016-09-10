/*! angular-signature-pad - v0.0.4 - 31 august 2016
* Copyright (c) G. Tomaselli <girotomaselli@gmail.com> 2015; Licensed  
*/

angular.module('ByGiro.signaturePad',[])
.directive('signaturePad', ['$window','$parse','$compile', function ($window, $parse, $compile) {
	
	contrFunction = ['$scope', '$timeout', '$element', '$attrs', '$parse', function($scope, $timeout, $element, $attrs, $parse){
			var defaultOpts = {
				height: 220,
				width: 568,
				clearBtn: 'Cancel',
				setModel: false
			},
			canvas,signaturePad;
			
			$scope.opts = angular.extend({},defaultOpts,$scope.opts);
			
			canvas = $element.find('canvas');
			signaturePad = new SignaturePad(canvas.get(0),$scope.opts);
			
			if ($scope.signature && !$scope.signature.$isEmpty && $scope.signature.dataUrl) {
			  signaturePad.fromDataURL($scope.signature.dataUrl);
			}

			var writingStarted = false;
			$element.on('mousedown touchstart',function(e){
				writingStarted = true;
			});
			
			angular.element(document).on('mouseup touchend',function(e){
				if(!writingStarted) return;
				
				writingStarted = false;
				// check the mouse up is on the canvas
				if(angular.equals(e.target, canvas[0])){
					$scope.dataVal = !signaturePad.isEmpty() ? signaturePad.toDataURL() : '';
					setModel();					
				} else {
					$scope.clear();
				}
			});
			
			$scope.clear = function () {
				signaturePad.clear();
				$scope.dataVal = '';
				setModel();
			};

			function setModel(){
				if(typeof $scope.opts.setModel == 'function'){
					$scope.opts.setModel($scope,$attrs,$parse);
					return;
				}
				if(!$attrs.modelKey || !$scope.$parent.model) return;

				var	modelGetter = $parse($attrs.modelKey);

				// This returns a function that lets us set the value of the ng-model binding expression:
				var modelSetter = modelGetter.assign;

				if(typeof modelSetter != 'function') return;

				modelSetter($scope.$parent.model, $scope.dataVal);
				$timeout();
			}
			
		}];
	
	return({
		scope: {
			opts: "=signaturePadOptions"
		},
		restrict: "A",
		replace: true,
		templateUrl: 'tmpl.html',
		controller: contrFunction
	});
}]);
