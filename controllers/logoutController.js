'use strict'
app.controller('logoutCtrl', ['$scope', '$http', 'api', '$filter', '$timeout','requestConfig','snackbar','AuthService','$location',function ($scope, $http, api, $filter, $timeout,requestConfig,snackbar,AuthService,$location) {
			console.log('ew')
			AuthService.logout()
			$location.path('/login')

		}
	])