'use strict'
app.controller('parametrosCtrl', ['$scope', '$http', 'api', '$filter', '$timeout','requestConfig','snackbar','$location',function ($scope, $http, api, $filter, $timeout,requestConfig,snackbar,$location) {
			var init = function(){
				$http.get(api.url + '/Smtp').then(function (data) {
					console.log(data)
						$scope.smtp = data.data
				})
				
			}
			init();
			$scope.location= $location.path();
			$scope.changeOrder = function (order) {
				$scope.asc = $scope.asc ? '' : '-';
				$scope.order = $scope.asc + order;
			}
			$scope.list = function () {
				$http.get(api.url + '/parametros').then(function (data) {
					console.log(data)
						$scope.data = data.data
				})
			}
			$scope.list();

			function update(form) {
				$http.put(api.url + '/parametros',form,requestConfig.headers).then(function (data) {
					snackbar.create("Dados salvos com sucesso!")
				})
			}
			$scope.salvar = function (form) {
				console.log(form)
				 update(form)
			}



		}
	])