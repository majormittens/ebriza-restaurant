angular.module('starter.controllers', ['filereader', 'azureBlobUpload', 'starter.services', 'angular-google-analytics', 'angularSpinner'])
	.constant('GoogleAnalytics', {
		ID: 'UA-73811203-4'
	})

.config(function(AnalyticsProvider, GoogleAnalytics) {
		AnalyticsProvider
			.trackPages(false)
			.setAccount(GoogleAnalytics.ID);
	})
	.directive('onReadFile', function($parse) {
		return {
			restrict: 'A',
			scope: false,
			link: function(scope, element, attrs) {
				var fn = $parse(attrs.onReadFile);

				element.on('change', function(onChangeEvent) {
					var reader = new FileReader();

					reader.onload = function(onLoadEvent) {
						scope.$apply(function() {
							fn(scope, {
								$fileContent: onLoadEvent.target.result
							});
						});
					};

					reader.readAsArrayBuffer((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
				});
			}
		};
	})

.controller('AppCtrl', function($scope) {

})

.controller('LoginCtrl', function($scope, cityazureapiservice, $state, GoogleAnalyticsService) {

	var vm = this;

	GoogleAnalyticsService.trackEvent('page', 'open', 'login', {
		dimension1: undefined
	});

	vm.login = function() {
		GoogleAnalyticsService.trackClick('logged-in-fb', {
			dimension1: undefined
		});
		cityazureapiservice.loginWithFacebookWithoutToken()
			.then(function(data) {
				//alert(JSON.stringify(cityazureapiservice.getUser()));
				$state.go('dashboard');
			});
	}

	vm.signup = function() {

		GoogleAnalyticsService.trackClick('sign-up', {
			dimension1: undefined
		});

		var member = vm.member;
		member.first_name = 'a';
		member.last_name = 'b';
		cityazureapiservice.signup(member)
			.then(function(data) {
				$state.go('dashboard');
			})
	}

	vm.loginEmail = function() {

		GoogleAnalyticsService.trackClick('login-email', {
			dimension1: undefined
		});

		var member = vm.member;

		cityazureapiservice.loginEmail(member)
			.then(function(data) {
				$state.go('dashboard');
			})
	}

	vm.create = function() {
		GoogleAnalyticsService.trackClick('create', {
			dimension1: undefined
		});

		$state.go('signup');
	}

})

.controller('DashboardCtrl', function($scope, FileReader, azureBlob, cityazureapiservice, GoogleAnalyticsService, usSpinnerService, $rootScope) {

	GoogleAnalyticsService.trackEvent('page', 'open', 'dashboard', {
		dimension1: undefined
	});

	var vm = this;

	cityazureapiservice.getTotal()
		.then(function(data) {
			console.log('total get', data);
			vm.total = data.total;
		});

	function resizeCanvasImage(img, maxWidth, maxHeight) {
		var imgWidth = img.width,
			imgHeight = img.height;

		var ratio = 1,
			ratio1 = 1,
			ratio2 = 1;
		ratio1 = maxWidth / imgWidth;
		ratio2 = maxHeight / imgHeight;

		// Use the smallest ratio that the image best fit into the maxWidth x maxHeight box.
		if (ratio1 < ratio2) {
			ratio = ratio1;
		} else {
			ratio = ratio2;
		}

		var canvas = document.createElement("canvas");
		var canvasContext = canvas.getContext("2d");
		var canvasCopy = document.createElement("canvas");
		var copyContext = canvasCopy.getContext("2d");
		var canvasCopy2 = document.createElement("canvas");
		var copyContext2 = canvasCopy2.getContext("2d");
		canvasCopy.width = imgWidth;
		canvasCopy.height = imgHeight;
		copyContext.drawImage(img, 0, 0);

		// init
		canvasCopy2.width = imgWidth;
		canvasCopy2.height = imgHeight;
		copyContext2.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvasCopy2.width, canvasCopy2.height);


		var rounds = 2;
		var roundRatio = ratio * rounds;
		for (var i = 1; i <= rounds; i++) {
			console.log("Step: " + i);

			// tmp
			canvasCopy.width = imgWidth * roundRatio / i;
			canvasCopy.height = imgHeight * roundRatio / i;

			copyContext.drawImage(canvasCopy2, 0, 0, canvasCopy2.width, canvasCopy2.height, 0, 0, canvasCopy.width, canvasCopy.height);

			// copy back
			canvasCopy2.width = imgWidth * roundRatio / i;
			canvasCopy2.height = imgHeight * roundRatio / i;
			copyContext2.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvasCopy2.width, canvasCopy2.height);

		} // end for


		// copy back to canvas
		canvas.width = imgWidth * roundRatio / rounds;
		canvas.height = imgHeight * roundRatio / rounds;
		canvasContext.drawImage(canvasCopy2, 0, 0, canvasCopy2.width, canvasCopy2.height, 0, 0, canvas.width, canvas.height);
		return canvas.toDataURL(
			"image/jpeg"
		);
	}

	//**dataURL to blob**
	function dataURLtoBlob(dataurl) {
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], {
			type: mime
		});
	}

	function Uint8ToBase64(u8Arr){
  var CHUNK_SIZE = 0x8000; //arbitrary number
  var index = 0;
  var length = u8Arr.length;
  var result = '';
  var slice;
  while (index < length) {
    slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length)); 
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  return btoa(result);
}


	vm.scan = function($fileContent) {
		//$scope.picSrc = $fileContent;
		console.log('asd', $fileContent);
		var filename = guid() + ".jpg";
		var blob = new Blob([$fileContent]);

		var base64String = Uint8ToBase64 (new Uint8Array($fileContent));
		var image = new Image();
		image.src = 'data:image/png;base64, ' + base64String;
		var newDataURL = resizeCanvasImage(image, 640, 480);
		console.log(newDataURL);
		blob = dataURLtoBlob(newDataURL);


		alert('Incepem incarcarea bonului. Acest proces dureaza cateva momente, te rugam sa ai rabdare :)');

		if (!$scope.spinneractive) {
			usSpinnerService.spin('spinner-1');
		}

		GoogleAnalyticsService.trackClick('upload', {
			dimension1: undefined
		});


		cityazureapiservice.getUploadToken(filename).then(function(data) {
			azureBlob.upload({
				baseUrl: "https://city365.blob.core.windows.net/mrcashback/" + filename,
				sasToken: "?" + data['token'],
				file: blob,
				complete: function() {
					cityazureapiservice.insert1(filename)
						.then(function(dat2) {
							if ($scope.spinneractive) {
								usSpinnerService.stop('spinner-1');
							}


							alert('Bonul a fost trimis! In cateva ore il vom verifica si iti vom adauga banii in cont. O zi faina!');



						})
				}
			});
		});
	}

	$scope.spinneractive = false;

	$rootScope.$on('us-spinner:spin', function(event, key) {
		$scope.spinneractive = true;
	});

	$rootScope.$on('us-spinner:stop', function(event, key) {
		$scope.spinneractive = false;
	});

	function guid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	}

})

.controller('AdminCtrl', function($scope, cityazureapiservice) {
	var vm = this;
	vm.changes = false;
	var baseUrl = "https://city365.blob.core.windows.net/mrcashback/";
	vm.bonuri = [];
	cityazureapiservice.getBonuri()
		.then(function(bonuri) {
			console.log("bonuri", bonuri);
			for (var bon in bonuri) {
				var url = baseUrl + bonuri[bon].filename;
				if (bonuri[bon].filename) {
					bonuri[bon].image_url = url;
					bonuri[bon].schimbat = false;
					vm.bonuri[vm.bonuri.length] = bonuri[bon];
				}
			}

		})



	vm.salveazaBon = function(bon) {
		bon.schimbat = false;
		var ceTrebe = {
			id: bon.id,
			number: bon.number,
			value: bon.value,
			store_name: bon.store_name
		}
		cityazureapiservice.updateBon(ceTrebe)
			.then(function(result) {
				alert('ok!');
			})
			.catch(function(err) {
				alert('ceva nu-i ok :(');
			})
	}

	vm.invoiceChanged = function(bon) {
		bon.schimbat = true;
	}

});