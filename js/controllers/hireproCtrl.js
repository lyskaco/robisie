app.controller("hireproCtrl",['$scope', 'srvAuth', '$sessionStorage', '$location', '$http', '$rootScope', '$filter', '$mdDialog', '$mdToast',
  function($scope, sAuth, $sessionStorage, $location, $http, $rootScope, $filter, $mdDialog, $mdToast) {

  		if(!$sessionStorage.user) {
  			$location.path('/login')
  		} else if ($sessionStorage.user && $sessionStorage.whatChoice) {
  			$location.path('/member/' + $sessionStorage.whatChoice);
  		} else if ($sessionStorage.user && !$sessionStorage.whatChoice) {
  			$location.path('/member/what-choice')
  		}

      $scope.showToast = function(string, number, callback) {
       if(number>0) { 
          $mdToast.show(
            $mdToast.simple()
            .textContent(string + number)
            .position('bottom', 'right')
            .hideDelay(3000)
        ).then(callback);
      } else { callback}
      }

  		$scope.currentNavItem = 'page2'
		  $scope.usersObject  = [];
      $scope.reviews = [];
      $scope.filter = {}
      $scope.filter.date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      $scope.svgClass = '';
      $scope.svgs = [{
        svg: 'delivery-truck.svg',
        service: 'moving',
        polish_name: 'Przeprowadzki'
      },{
        svg: 'housekeeping.svg',
        service: 'cleaning',
        polish_name: 'Sprzątanie'
      },{
        svg: 'package.svg',
        service: 'assembly',
        polish_name: 'Składanie mebli'
      },{
        svg: 'repair.svg',
        service: 'handyman',
        polish_name: 'Złota rączka'
      },{
        svg: 'trash.svg',
        service: 'gardening',
        polish_name: 'Ogrodnik'
      }]



      //
      // $scope.toggleSVG = function(item) {
      //   $scope.filter.category = item.service;
      // }
      $scope.user = JSON.parse(JSON.stringify($sessionStorage.user));


      $scope.getUserData = function() {

          $http({
          method: 'POST',
          url: "https://robisie.co/api/index.php",
          headers: {
              'Access-Control-Allow-Methods':'POST, GET, OPTIONS',
              "Access-Control-Allow-Origin": "*",
              'Access-Control-Allow-Headers': 'origin, content-type, accept'
          },
          data: {
            operation: 'getuserdata',
            email: $sessionStorage.user.email
          }
      }).
      success(function (response) {

         $scope.user = response.user_data[0];
         $scope.request_given = response.user_data.request_g;
         $scope.reviewMissing = 0;
         $scope.proConfirmed = 0;

          if($scope.request_given) {
          for(var i = 0; i<$scope.request_given.length; i++) {

            if($scope.request_given[i].status_request === 'completed' && $scope.request_given[i].isReview_Written==="0") {
                $scope.reviewMissing++;
            }
            if($scope.request_given[i].status_request === 'donePro') {
                 $scope.proConfirmed++;
            }
          }
        }

        $scope.showToast('Liczba recenzji do napisania: ', $scope.reviewMissing, function(){$scope.showToast('Liczba specjalistów czekających na: ',  $scope.proConfirmed)});

      }).
      error(function (data, status, headers, config) {
         
       
      });

      }

      $scope.getUserData()

    $scope.editDataDialog = function(ev) {
       $rootScope.blurTrigger = true;
      $mdDialog.show({
      controller: 'dialogEditDataCtrl',
      templateUrl: 'js/views/editDataDialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        user:  $sessionStorage.user
     }
    })
    .then(function(picture) {

      if(!$scope.user.picture) {
          $scope.user.picture = picture;
      }
       $rootScope.blurTrigger = false;
       $scope.getUserData();
    });
  }; 

    

   $scope.scheduleFilter = [];
   $scope.showOffers = false;


   $scope.selectOffers = function() {
       $http({
          method: 'POST',
          url: "https://robisie.co/api/index.php",
          data: {
            operation: 'selectoffer'
          }
      }).
      success(function(response) {

      	if(response.offers) {
         var offers = response.offers

         for(var i = 0; i<offers.length; i++) {
            offers[i].professional_availability_week = offers[i].professional_availability_week.split(',');
            offers[i].professional_field = offers[i].professional_field.split(',');
            if(offers[i].professional_schedule) {
              var splitted = offers[i].professional_schedule.split('/');
              var arrayOfSchedules = [];
              splitted.forEach(function(elem, index, array){
                var secondSplit = elem.split(','),
                    schedule = {};
                schedule.startDate = secondSplit[0];
                schedule.endDate= secondSplit[1];
                arrayOfSchedules.push(schedule);
              })

              offers[i].professional_schedule = arrayOfSchedules;
          }
         }
          
         $scope.offers = offers;

     }

      }).
      error(function (data, status, headers, config) {
         
      });
   }
   $scope.selectOffers();
   $scope.setScheduleFilter = function() {
      var startDate = new Date($scope.filter.date),
          endDate = new Date($scope.filter.date),
          dayDate = new Date($scope.filter.date),
          timestamp = new Date(new Date().getTime() + 24 * 60 * 60 * 1000),

          startHour = $scope.filter.startTime.getHours(),
          startMinutes = $scope.filter.startTime.getMinutes();

          $scope.weekFilter = moment(dayDate).format('dddd').toLowerCase();


          startDate.setHours(startHour);
          startDate.setMinutes(startMinutes);
          endDate.setHours(startHour + $scope.jobDuration);
          endDate.setMinutes(startMinutes);
          
          var startMillis = startDate.getTime(),
              endMillis = endDate.getTime();
              $scope.startMillis = startMillis;
              $scope.endMillis = endMillis;
        if(timestamp > startMillis) { 
          $scope.filterMessage = 'Wybierz poprawną datę!'
        } else {
            $scope.limit = 2;
            $scope.scheduleFilter = [];
            if($scope.offers) {
                for(var i = 0; i<$scope.offers.length; i++) {

                  if($scope.offers[i].professional_schedule) {
                    for(var j = 0; j<$scope.offers[i].professional_schedule.length; j++) {

                        var scheduleStart = $scope.offers[i].professional_schedule[j].startDate,
                            scheduleEnd = $scope.offers[i].professional_schedule[j].endDate;

                            if((scheduleStart >= startMillis && scheduleStart<=  endMillis) ||
                                    (startMillis >= scheduleStart && startMillis <=  scheduleEnd)) {
                                       $scope.scheduleFilter.push($scope.offers[i])
                                    } 
                    } 
                  } else { console.log('No schedule.')}
                }
              } else {
                $scope.filterMessage =  'Brak wyników';
              }
              $scope.filterMessage = '';
              $scope.showOffers = true;
          }
          

      
   }

   $scope.myFilterBy = function(e) {
  return $scope.scheduleFilter.indexOf(e) === -1;
}


 $scope.profileReviewsGet = function(offer) {
      $scope.reviews = []
      var pid = offer.professional_id;
        for (var i = 0; i<$scope.usersObject.length; i++) {
          if($scope.usersObject[i].uid == pid) {
              $scope.reviews = $scope.usersObject[i].reviews;
          }
        }
    }
  $scope.showReviews = function(ev, offer) {
    $rootScope.blurTrigger = true;
    $scope.profileReviewsGet(offer);
    $mdDialog.show({
      controller: 'dialogReviewsCtrl',
      templateUrl: 'js/views/reviewsDialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      // clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        reviews: $scope.reviews,
        offer: offer
     }
    })
    .then(function(answer) {
      $rootScope.blurTrigger = false;
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };

  $scope.writeReview = function(event, request) {
    $mdDialog.show({
      controller: 'dialogWriteReviewCtrl',
      templateUrl: 'js/views/writeReviewDialog.html',
      parent: angular.element(document.body),
      targetEvent: event,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        request: request,
        user: $scope.user
     }
    })
    .then(function(answer) {
        $scope.getUserData()
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  }

$scope.confirmDoneCustomer = function(request, answer) {
  var request = request,
      answer = answer;


      var confirm = $mdDialog.confirm()
              .title('Na pewno chcesz to zrobić?')
              // .textContent('')
              .ariaLabel('reject or accept')
              .ok('Tak!')
              .cancel('Nie!');

        $mdDialog.show(confirm).then(function() {
          $http({
          method: 'POST',
          url: "https://robisie.co/api/index.php",
          data: {
            operation: 'confirmdonecustomer',
            offer_id: request.id_Request,
            doneOrNot: answer
          }
      }).
      success(function (response) {

        
           $scope.getUserData();
      }).
      error(function (data, status, headers, config) {  
          
      });
        }, function() {
        });  
 
}


  $scope.bookPro = function(ev, offer) {
    $rootScope.blurTrigger = true;
    $mdDialog.show({
      controller: 'dialogBookProCtrl',
      templateUrl: 'js/views/bookProDialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
      locals: {
        offer: offer,
        user: $scope.user,
        mySchedule: {
          startTime: $scope.startMillis,
          endtime: $scope.endMillis,
          field: $scope.filter.category,
          duration: $scope.jobDuration
        }
     }
    })
    .then(function(answer) {
      $rootScope.blurTrigger = false
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };



    $scope.requestTimeSort = function(offer) {
      var date = new Date(offer.timeStamp);
    return date;
};


  }])