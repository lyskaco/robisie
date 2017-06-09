app.controller("paymentCtrl",
  function($scope, $mdDialog, $http, $localStorage, $location, $timeout) {
  	$scope.localStorage = $localStorage;
    $scope.isLoading = true;

  	if(!$localStorage.latest_order_id) {
  			$location.path('/hello')
  	}

  	$scope.checkOrderStatus = function() {
      $timeout(function(){  $http({
          method: 'POST',
          url: "https://robisie.co/api/index.php",
          data: {
            operation: 'checkorderstatus',
            order_id: $scope.localStorage.latest_order_id
            }    
      }).
      success(function (response) {
          console.log(response)
          $scope.response = response;
          $scope.isLoading = false;
          
          $scope.localStorage.latest_order_id = null;
      }).
      error(function (data, status, headers, config) {
          $scope.localStorage.latest_order_id = null;
          $scope.isLoading = false;
      }); }, 0)
  	 
}

  $scope.checkOrderStatus();

})