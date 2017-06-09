app.controller("dialogReviewsCtrl",
  function($scope, reviews, offer, $mdDialog, $http) {
  	 $scope.offer = offer;
    $scope.close = function() {
      
      $mdDialog.hide()
    }
  	$scope.getReviews = function() {

  		$scope.reviewsLoading = true;

          $http({
          method: 'POST',
          url: "https://robisie.co/api/index.php",
          data: {
            operation: 'getproreview',
            email: $scope.offer.professional_email
          }
      }).
      success(function (response) {
      	$scope.reviews = response.reviews
      	$scope.reviewsLoading = false;
      }).
      error(function (data, status, headers, config) {
        $scope.reviewsLoading = false;
      });

      }

      $scope.getReviews()

  	  $scope.hideDialogReviews = function() {
      $mdDialog.hide()
  }
  })