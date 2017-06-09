app.controller("passwordforgotCtrl",
  function($scope, $http, $sessionStorage, $location, $window, $localStorage, $routeParams) {
 	if(angular.equals({}, $routeParams)) {
        $location.path('/iforgot')
    } else {

      $scope.forgot = {}
    	$scope.forgotToken = $routeParams.token;
    	console.log($scope.forgotToken)
      $scope.loading = true;
    	$http({
          method: 'POST',
          url: "https://robisie.co/api/index.php",
          data: {
            operation: 'forgotpasswordsendtoken',
            token: $scope.forgotToken
            }    
      }).
      success(function (response) {
        	$scope.tokenResponse = response;
           $scope.loading = false;
      }).
      error(function (data, status, headers, config) {
          $scope.loading = false;
      });
    }

    $scope.forgetPasswordInit = function(email) {
      console.log(email)
      console.log($scope.forgot.email)

  		$http({
          method: 'POST',
          url: "https://robisie.co/api/index.php",
          data: {
            operation: 'forgotpasswordinit',
            email: $scope.forgot.email
            }    
      }).
      success(function (response) {
        console.log(response)
      	if(response.result === 'success') {
            $scope.forgotPasswordSendEmailResult = 'Mail z linkiem do zresetowania hasła został wysłany.'
      	} else if(response.result === 'success' && response.message === "email doesn't exist in DB") {
          $scope.forgotPasswordSendEmailResult = 'Nie ma takiego adresu email w bazie danych.'
        } else {
          $scope.forgotPasswordSendEmailResult = 'Coś poszło nie tak, spróbuj jeszcze raz.'
        }
      }).
      error(function (data, status, headers, config) {

      });
  	}


  })