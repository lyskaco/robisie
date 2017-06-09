app.controller("dialogWriteReviewCtrl",
  function($scope, request, user, $mdDialog, $http) {
	  	$scope.request = request;
	  	$scope.user = user;
	  	console.log($scope.request)
  	   $scope.hideDialogReviews = function() {
      $mdDialog.hide()
  }


  	$scope.writeReview = function() {


  		console.log($scope.review)
          $http({
          method: 'POST',
          url: "https://robisie.co/api/index.php",
          data: {
            operation: 'makereview',
            customer_email: $scope.user.email,
            request_id: $scope.request.id_Request,
            professional_email: $scope.request.email_professional,
            review: $scope.review
          }
      }).
      success(function (response) {

      	if(response.result==='success') {
      		 $mdDialog.hide()
      		  $mdDialog.show(
		      $mdDialog.alert()
		        .parent(angular.element(document.querySelector('#popupContainer')))
		        .clickOutsideToClose(true)
		        .title('Udało się!')
		        .textContent('Dodano recenzję')
		        .ariaLabel('Alert Dialog Demo')
		        .ok('OK')
		    );
      	}

      	
      }).
      error(function (data, status, headers, config) {
         
       
      });

      }
  })