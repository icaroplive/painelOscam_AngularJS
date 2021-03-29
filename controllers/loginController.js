'use strict'
app.controller('loginCtrl', ['$scope', '$http', 'api', 'snackbar','AuthService','$location',  function ($scope, $http, api,snackbar,AuthService,$location) {
		
$scope.doLogin = function()		 {
	$scope.dataLoading = true;
	$http.post(api.url + '/Account/login', {'Email' : $scope.username, 'Password': $scope.password}).then(function(data){
			AuthService.setToken(data.data)
			$location.path('/user')
		
			},function(data) {
				$scope.dataLoading=false;
				snackbar.create("Acesso negado");
			})
		}


	}
])