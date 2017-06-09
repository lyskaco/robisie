var app = angular.module("myApp", [ 'ngMaterial','ngRoute', 'ngStorage', 'mdPickers', 'ngAnimate', 'ngLiveChat']);
  
app.config(function($routeProvider, $locationProvider) {

    $routeProvider
    .when("/hello", {
        templateUrl : "js/views/greetings.html",
        controller : 'greetingsCtrl'
    })
    .when("/login", {
        templateUrl : "js/views/login.html",
        controller : 'loginCtrl'
    })
    .when("/register", {
        templateUrl : "js/views/register.html",
        controller : 'registerCtrl'
    })
    .when('/member', {
      templateUrl: 'js/views/member.html',
      controller: 'memberCtrl'
    })
    .when('/member/what-choice', {
      templateUrl: 'js/views/what-choice.html',
      controller: 'memberCtrl'
    })
    .when('/member/becomepro', {
      templateUrl: 'js/views/becomepro.html',
      controller: 'becomeproCtrl'
    })
    .when('/member/hirepro', {
      templateUrl: 'js/views/hirepro.html',
      controller: 'hireproCtrl'
    })
    .when('/member/admin-panel', {
      templateUrl: 'js/views/admin-panel.html',
      controller: 'adminpanelCtrl'
    })
    .when('/howitworks', {
      templateUrl: 'js/views/howitworks.html',
      controller: 'howitworksCtrl'
    })
    .when('/paymentstatus', {
      templateUrl: 'js/views/paymentstatus.html',
      controller: 'paymentCtrl'
    })
     .when('/iforgot', {
      templateUrl: 'js/views/passwordforgot.html',
      controller: 'passwordforgotCtrl'
    })
     .when('/iforgot/:token?', 
      { templateUrl: 'js/views/passwordforgot.html',
      controller: 'passwordforgotCtrl'})
     .when('/rules', 
      { templateUrl: 'js/views/rules.html',
      controller: 'howitworksCtrl'})
     
    .otherwise({ redirectTo: '/hello' });
    // $locationProvider.html5Mode(true);
});

app.run(['$rootScope', '$window', 'srvAuth',
  function($rootScope, $window, sAuth) {

  $rootScope.user = {};

  $window.fbAsyncInit = function() {

    FB.init({

      appId: '1206693522785012',
      status: true,
      cookie: true,
      xfbml: true,
      version: 'v2.4'
    });

    sAuth.watchLoginChange();

  };

  (function(d){
    // load the Facebook javascript SDK

    var js,
    id = 'facebook-jssdk',
    ref = d.getElementsByTagName('script')[0];

    if (d.getElementById(id)) {
      return;
    }

    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/sdk.js";

    ref.parentNode.insertBefore(js, ref);

  }(document));

}]);

app.config(function($mdDateLocaleProvider) {
  $mdDateLocaleProvider.formatDate = function(date) {
    return moment(date).format('DD.MM.YYYY');
  };
    $mdDateLocaleProvider.months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    $mdDateLocaleProvider.shortMonths = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];
    $mdDateLocaleProvider.days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    $mdDateLocaleProvider.shortDays = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'];
});
app.config(function($mdIconProvider) {
    $mdIconProvider
       .iconSet('services', '/icons/services.svg', 50)
       //.defaultIconSet('img/icons/sets/core-icons.svg', 24);
   });
app.directive('chooseFile', function() {
    return {
      link: function (scope, elem, attrs) {
        var button = elem.find('button');
        var input = angular.element(elem[0].querySelector('input#fileInput'));
        button.bind('click', function() {
          input[0].click();
        });
        input.bind('change', function(e) {
          scope.$apply(function() {
            var files = e.target.files;
            if (files[0]) {
              scope.image = files[0];
            } else {
              scope.image = null;
            }
          });
        });
      }}});

app.directive('apsUploadFile', apsUploadFile);
function apsUploadFile() {
  var directive = {
    restrict: 'E',
    template: '<input id="fileInput" type="file" class="ng-hide"> <md-button id="uploadButton" class="md-raised md-cornered" aria-label="attach_file"> Wybierz plik </md-button><md-input-container  md-no-float>    <input id="textInput" ng-model="fileName" type="text" placeholder="Nie wybrano pliku" ng-readonly="true"></md-input-container>',
    link: apsUploadFileLink
  };
  return directive;
}

function apsUploadFileLink(scope, element, attrs) {
  var input = $(element[0].querySelector('#fileInput'));
  var button = $(element[0].querySelector('#uploadButton'));
  var textInput = $(element[0].querySelector('#textInput'));

  if (input.length && button.length && textInput.length) {
    button.click(function(e) {
      input.click();
    });
    textInput.click(function(e) {
      input.click();
    });
  }

  input.on('change', function(e) {
    var files = e.target.files;
    if (files[0]) {
      scope.fileName = files[0].name;
      scope.image = files[0];
    } else {
      scope.fileName = null;
      scope.image = null;
    }
    scope.$apply();
  });
}
app.directive('contenteditable', ['$sce', function($sce) {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, element, attrs, ngModel) {
      if (!ngModel) return; // do nothing if no ng-model

      // Specify how UI should be updated
      ngModel.$render = function() {
        element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
      };

      // Listen for change events to enable binding
      element.on('blur keyup change', function() {
        scope.$evalAsync(read);
      });
      read(); // initialize

      // Write data to the model
      function read() {
        var html = element.html();
        // When we clear the content editable the browser leaves a <br> behind
        // If strip-br attribute is provided then we strip this out
        if ( attrs.stripBr && html == '<br>' ) {
          html = '';
        }
        ngModel.$setViewValue(html);
      }
    }
  };
}]);