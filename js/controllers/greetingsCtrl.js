app.controller("greetingsCtrl",['$scope', 'srvAuth', '$sessionStorage', '$location',
  function($scope, sAuth, $sessionStorage, $location) {
  	//$sessionStorage.user = 4
	//$scope.$storage = $sessionStorage;
	$scope.becomePro = function() {
		$sessionStorage.whatChoice = 'becomepro';
		if(!$sessionStorage.user) {
			$location.path('/login')
		} else {
			$location.path('/member')
		}
	}

	$scope.hirePro = function() {
		$sessionStorage.whatChoice = 'hirepro';
		if(!$sessionStorage.user) {
			$location.path('/login')
		} else {
			$location.path('/member')
		}
	}
}]);