/*! angular-signature-pad - v0.0.2 - 14 giugno 2015
* Copyright (c) G. Tomaselli <girotomaselli@gmail.com> 2015; Licensed  
*/

angular.module('ByGiro.signaturePad',[])
.directive('signaturePad', ['$window','$timeout', function ($window, $timeout) {
	var signaturePad, signature, canvas;
	
	function link( scope, element, attributes) {

		var bg = (typeof jQuery != 'undefined') ? jQuery : angular.element,
		options = {
			height: 220,
			width: 568,
			clearBtn: 'Cancel'
		};
		
		for(var k in options){
			if(attributes[k]){
				options[k] = attributes[k];
			}
		}		
		scope.opts = options;
		
		$timeout(function () {
			// This code will run after
			// templateUrl has been loaded, cloned
			// and transformed by directives.			
			canvas = element.find('canvas');
			signaturePad = new SignaturePad(canvas.get(0));
			
			if (scope.signature && !scope.signature.$isEmpty && scope.signature.dataUrl) {
			  signaturePad.fromDataURL(scope.signature.dataUrl);
			}
			
			canvas.on('mouseup',function(){
				signature = '';
				if (!signaturePad.isEmpty()) {
					signature = signaturePad.toDataURL();
				}				
				updateModel();
			});
			
		}, 0);

		scope.clear = function () {
			signaturePad.clear();
			signature = '';
			updateModel();
		};
		
		function updateModel(){
			if(!attributes.model) return;
			
			// update the scope
			var phase = scope.$root.$$phase;
			if (phase == '$apply' || phase == '$digest') {
				scope.dataVal = signature;	
			} else {
				scope.$apply(function(){
					scope.dataVal = signature;
				});
			}
		}
	}

	return({
		restrict: "A",
		scope: {
			accept: '=?',
			clear: '=?',
			dataVal: "=?model"
		},
		link: link,
		templateUrl:'tmpl.html'
	});
}]);