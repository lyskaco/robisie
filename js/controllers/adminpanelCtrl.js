app.controller("adminpanelCtrl",function($scope,$sessionStorage,$location,$http,$mdDialog){if(!$sessionStorage.adminAccess){$location.path('/login')}$scope.selectOffers=function(){$http({method:'POST',url:"https://robisie.co/api/index.php",data:{operation:'selectofferadmin'}}).success(function(response){console.log(response)
let offers=response.offers;for(let i=0;i<offers.length;i++){offers[i].professional_availability_week=offers[i].professional_availability_week.split(',');offers[i].professional_field=offers[i].professional_field.split(',');}$scope.offers=response.offers}).error(function(data,status,headers,config){console.log(status)});}
$scope.getComplicatedRequests=function(){$http({method:'POST',url:"https://robisie.co/api/index.php",data:{operation:'getrequestcomplicated'}}).success(function(response){console.log(response)
$scope.complicatedRequests=response.offers;}).error(function(data,status,headers,config){});}
$scope.getComplicatedRequests();$scope.selectOffers();$scope.showDialogOffer=function(ev,offer){$mdDialog.show({controller:'dialogAdminShowOfferCtrl',templateUrl:'js/views/dialogAdminShowOffer.html',parent:angular.element(document.body),targetEvent:ev,fullscreen:$scope.customFullscreen,locals:{offer:offer}}).then(function(picture){$scope.selectOffers()});};$scope.getSingleRequest=function(){console.log($scope.idRequest)
$http({method:'POST',url:"https://robisie.co/api/index.php",data:{operation:'getsinglerequest',idrequest:$scope.idRequest}}).success(function(response){console.log(response)
$scope.singleRequest=response.offers[0];}).error(function(data,status,headers,config){console.log(status)});}
$scope.setResolved=function(request){var id=request.id_Request;if(confirm('Na pewno chcesz zmienić status?')){$http({method:'POST',url:"https://robisie.co/api/index.php",data:{operation:'setresolved',status:'resolved',idrequest:id}}).success(function(response){console.log(response)}).error(function(data,status,headers,config){});}}
$scope.setRefund=function(request){var id=request.id_Request;if(confirm('Na pewno chcesz zrobić zwrot?')){$http({method:'POST',url:"https://robisie.co/api/index.php",data:{operation:'setrefund',idrequest:id}}).success(function(response){console.log(response)}).error(function(data,status,headers,config){});}}
$scope.offersTypeFilter=function(){}})