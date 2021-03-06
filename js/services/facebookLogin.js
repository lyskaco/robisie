app.factory("srvAuth", ['$rootScope', '$sessionStorage', '$location', '$http',
    function($rootScope, $sessionStorage, $location, $http) {
      var srvAuth = {};

      function sendData(res) {

            var data = {
                first_name : res.first_name,
                last_name : res.last_name,
                email : res.email
            }

        $http({
                  method: 'POST',
                  url: 'https://robisie.co/api/index.php',
                  data: {
                    operation: 'register-fb',
                    user: data
                              
                        }
                        }).then(function successCallback(response) {
                    $sessionStorage.user = data;
                    if ($sessionStorage.whatChoice) {

                         $location.path('/member')

                    } else {
                        $location.path('/member/what-choice')
                     }
                }, function errorCallback(response) {
                });

            }

      srvAuth.fblogin = function() {
        FB.login(function (response) {
          if (response.status === 'connected') {
              if($sessionStorage.whatChoice){

                      $location.path('/member')

                    } else {
                      $location.path('/member/what-choice')
                    }
              
            	return response;
          }
        }, {scope: 'email'});        
      }

      srvAuth.watchLoginChange = function() {
        var _self = this;
        FB.Event.subscribe('auth.authResponseChange', function(res) {
          if (res.status === 'connected') {

            if(!$sessionStorage.user) {
            FB.api('/me', {
                fields: 'first_name, last_name, email, gender'}, function(res) {
                $sessionStorage.FID = res.id;

                sendData(res)
            });
          }
          } else {
            //alert('Not Connected');
          }
        });

      }
      srvAuth.logout = function() {
        var _self = this;
        FB.logout(function(response) {
            $rootScope.$apply(function() {
            $rootScope.user = _self.user = null;
            $sessionStorage.user = $rootScope.user;
            $sessionStorage.FID = null;
          });
        });
      }

    srvAuth.onSuccess = function(googleUser) {

   		 var profile = googleUser.getBasicProfile(),
           data = {
              first_name: profile.getGivenName(),
              last_name: profile.getFamilyName(),
              email:  profile.getEmail()
              };

       $sessionStorage.GID = profile.getId();
         sendData(data)

   		 if(!$sessionStorage.user) {
   		 	$rootScope.$apply(function() {
   		 	$sessionStorage.user = {};
   		 	$sessionStorage.user = data;
        $location.path('/member')
   		 })
   		 }
}
	srvAuth.onFailure = function(error) {
	}

	srvAuth.signOut = function() {
	    var auth2 = gapi.auth2.getAuthInstance();
	    auth2.signOut().then(function () {
	        $('.userContent').html('');
	        $('#gSignIn').slideDown('slow');
	    });
	}



      return srvAuth;
    }
  ]);
