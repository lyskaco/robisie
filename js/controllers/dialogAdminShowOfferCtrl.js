app.controller("dialogAdminShowOfferCtrl", function($scope, offer, $sessionStorage, $location, $http, $mdDialog) {
	$scope.offer = offer;
	console.log($scope.offer)
	$scope.close = function() {
		$mdDialog.hide()
	}

	$scope.verify = function(command) {
		var command = command;

    console.log(command)
		if(confirm('Na pewno chcesz to zrobić?')) {
  		$http({
          method: 'POST',
          url: "https://robisie.co/api/index.php",
          data: {
           operation: 'verify',
           command: command,
           offer_Id: $scope.offer.offer_Id
          }
      }).
      success(function (response) {
          $mdDialog.hide()
      }).
      error(function (data, status, headers, config) {
         
        console.log(status)
      });
  }
	}

	$scope.delete = function() {


	if(confirm('Na pewno chcesz to zrobić?')) {
  		$http({
          method: 'POST',
          url: "https://robisie.co/api/index.php",
          data: {
           operation: 'deleteofferadmin',
           offer_Id: $scope.offer.offer_Id
          }
      }).
      success(function (response) {
          $mdDialog.hide()
      }).
      error(function (data, status, headers, config) {
         
        console.log(status)
      });
  }
	}
})