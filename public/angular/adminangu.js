
var app = angular.module('adminloginApp', ['config','ngCookies','ui-notification'])


function url_base64_decode(str) {
    var output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
        case 0:
            break;
        case 2:
            output += '==';
            break;
        case 3:
            output += '=';
            break;
        default:
            throw 'Illegal base64url string!';
    }
    return window.atob(output);
}


var baseAddress = config_module._invokeQueue[0][2][1].LOGIN_URL;

var url = "";

app.factory('userFactory', function ($http, $window) {

    return {
        
        addUser: function (beer) {

            url = baseAddress + "signUp/";
            return $http.post(url, beer);
        }

    }
    })

app.controller('AdminLoginController', function($scope, $http,userFactory, $window, $cookies, $cookieStore, $location,Notification) {

// USER LOGIN

$scope.postForm = function() {
    var admindata = this.user;


    console.log("admindata.emailId : ", admindata.emailId);
    console.log("admindata.role : ",admindata.role);
    
    console.log("inside postForm() admindata", admindata);
    console.log("inside postForm()");
         
         if(admindata ==undefined || (admindata.password==null || admindata.password==undefined || admindata.password=='') &&(admindata.userId==null || admindata.userId==undefined || admindata.userId=='')){
    Notification.error('emailId and password required');
    }
    else if(admindata.emailId==null || admindata.emailId==undefined || admindata.emailId==''){
    Notification.error('emailId required');
 }
    else if(admindata.password==null || admindata.password==undefined || admindata.password==''){
    Notification.error('password required');
    }
    else{
        console.log("inside else======");
    var encodedString = 'emailId=' + encodeURIComponent(admindata.emailId) +'&password=' + encodeURIComponent(admindata.password);
        console.log("encodedString======", encodedString);
    $http.post('/login', admindata).success(function(data, status, headers, config) {
            console.log("inside post======");
           
           if (data.message == "NO_EMAIL"){
               
              Notification.error('You are not Registered user with this email');
           }else if (data.message == "WRONG_PASS"){
               
              Notification.error('Wrong Password');
           }else{
           var consoledata = data.token;
           console.log("consolidata", consoledata);
            $window.localStorage.token = consoledata;
           if(!consoledata){
                //alert("You are not authorised user");
                Notification.error('You are not Registered user');
                //window.location.href = '/admin';
            }
            var encodedProfile = consoledata.split('.')[1];
            
            var profile = JSON.parse(url_base64_decode(encodedProfile));
            console.log("profile", profile);
             
                    Notification.success('Admin Login Success');
                    window.location.href = '/Reg';
                    
               
              
        }
            })
            
            
        }
        
    }

    // ADD USER

    $scope.addUser = function () {
        var currentbeer = this.user;

        console.log("currentbeer", currentbeer);
        if (currentbeer.name != null && currentbeer.emailId != null) {

            userFactory.addUser(currentbeer).success(function (data) {

                if (data == 'ER_DUP_ENTRY') {
                    Notification.error({
                        message: currentbeer.name + ' ' + 'Already Entered ',
                        delay: null
                    });
                } else {

                    $scope.addMode = false;
                    currentbeer = data;


                    Notification.success({
                        message: currentbeer.name + ' ' + ', Beer Created Successfully ',
                        delay: 1000
                    });

                    //reset form
                    $scope.beer = null;

                    //$window.location.reload();


                }
            }).error(function (data) {

                Notification.error({
                    message: currentbeer.name + ' ' + ',Beer Adding Failed ',
                    delay: 1000
                });
                //$scope.error = "An Error has occured while Adding userProfile! " + data.ExceptionMessage;
            });
        }
    };


})