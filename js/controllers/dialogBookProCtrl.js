app.controller("dialogBookProCtrl",function($scope,offer,user,mySchedule,$mdDialog,$http,$sessionStorage,$location,$window,$localStorage){$scope.offer=offer;$scope.user=user;$scope.mySchedule=mySchedule;var prices=$scope.offer.price
$scope.priceSummary=Math.floor(Number($scope.offer.price[$scope.mySchedule.field])*Number($scope.mySchedule.duration)*100)/100;$scope.mdDialog=$mdDialog;$scope.closeDialog=function(){$mdDialog.hide()}
$scope.makeRequest=function(){var contact={};if(!user.address||!user.phone){contact={phone:$scope.missingTelephone,address:$scope.missingAddress}}else if($scope.wantToChange){contact={phone:$scope.changedTelephone,address:$scope.changedAddress}}else if(user.address&&user.phone){contact={phone:user.phone,address:user.address}}if($scope.creditCardPayment){$scope.method='C';}else{$scope.method='V';}$http({method:'POST',url:"https://robisie.co/api/index.php",headers:{'Access-Control-Allow-Methods':'POST, GET, OPTIONS',"Access-Control-Allow-Origin":"*",'Access-Control-Allow-Headers':'origin, content-type, accept'},data:{operation:'makerequest',customer_email:$scope.user.email,professional_email:$scope.offer.professional_email,method:$scope.method,selectedCode:$scope.selectedCode,creditCardData:$scope.creditCard,request:{startTime:$scope.mySchedule.startTime,endTime:$scope.mySchedule.endtime,jobDuration:$scope.mySchedule.duration,field:$scope.mySchedule.field,price:$scope.priceSummary,priceBase:$scope.offer.price_Base[$scope.mySchedule.field],contact:contact}}}).success(function(response,headers){function saveStorage(callback){$localStorage.latest_order_id=response.order_id;$mdDialog.hide()
callback()}function redirect(){$window.location.href=response.link;}if(response.result==='success'){saveStorage(redirect);}else{}}).error(function(data,status,headers,config){});}});