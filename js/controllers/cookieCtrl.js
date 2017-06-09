app.controller("cookieCtrl",['$scope','$localStorage', '$sessionStorage', '$location',
  function($scope, sAuth, $localStorage, $sessionStorage, $location) {

  		$scope.localStorage = $localStorage;
  		console.log($localStorage)
  		$scope.setCookieAccepted = function() {

  			$scope.localStorage.isCookieAccepted = true;
  		}
	
  }])