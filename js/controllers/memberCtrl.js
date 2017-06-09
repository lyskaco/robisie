app.controller("memberCtrl",['$scope', 'srvAuth', '$sessionStorage', '$location',
  function($scope, sAuth, $sessionStorage, $location) {

  		if(!$sessionStorage.user) {
  			$location.path('/login')
  		} else if ($sessionStorage.user && $sessionStorage.whatChoice && !$sessionStorage.adminAccess ) {
  			$location.path('/member/' + $sessionStorage.whatChoice);
  		} else if ($sessionStorage.user && !$sessionStorage.whatChoice && !$sessionStorage.adminAccess) {
  			$location.path('/member/what-choice')
  		} else if ($sessionStorage.user && $sessionStorage.adminAccess) {
  			$location.path('/member/admin-panel')
  		}

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


	
  }])