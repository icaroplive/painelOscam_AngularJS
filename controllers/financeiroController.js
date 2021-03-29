'use strict'
app.controller('financeiroCtrl', ['$scope', '$http', 'api', '$filter', '$timeout','requestConfig','snackbar','$location',  function ($scope, $http, api, $filter, $timeout,requestConfig,snackbar,$location) {
			$scope.location= $location.path();
			$scope.itemsPerPage = 5;
			$scope.order = 'nome';
			$scope.asc = false;
			$scope.up = {};
			$scope.sucesso = true;
			$scope.ew = function () {
				$timeout(function () {
					angular.element('#Dados').trigger('click');
				})

			}
			$scope.changeOrder = function (order) {
				$scope.asc = $scope.asc ? '' : '-';
				$scope.order = $scope.asc + order;
			}
			$scope.list = function () {
				$http.get(api.url + '/financeiro',requestConfig.headers).then(function (data) {
						$scope.data = data.data
				})
			}
			$scope.list();

			$scope.editar = function (dados) {
				dados.dataVencimento=$filter("date")(dados.dataVencimento,'dd/MM/yyyy')
				console.log('editar')
				console.log(dados)
				$scope.up2=dados;
				$scope.up = angular.copy(dados);
				$('#modalupload').modal('show');
			}
			
			function save(form) {
				$http.post(api.url + '/financeiro',form,requestConfig.headers).then(function (data) {
					$scope.data.push(data.data);
					snackbar.create("Dados salvos");
					
				},function(data) {
					console.log(data)
					return data;
				})
				
			}
			function update(form) {
				console.log('update')
				console.log(form)
				$http.put(api.url + '/financeiro/'+ form.id,form,requestConfig.headers).then(function (data) {
					$scope.data[$scope.data.indexOf($scope.up2)] = data.data
					snackbar.create("Dados salvos com sucesso!")
					$('#modalupload').modal('hide');
				},function(data) {
					console.log(data)
					snackbar.create("Nao foi possivel salvar as alterações: " + data.data.value.error? data.data.value.error: data.statusText)
				})
			}
			$scope.salvar = function (form) {
	
				if (!form.id) {
					var data = save(form);
				}
				else { var data = update(form); }
			}
			$scope.excluir = function(cat) {
				if (confirm("Deseja excluir o registro de " + cat.nome + '?')) {
					
					$http.delete(api.url + '/financeiro/' + cat.id,requestConfig.headers).then(function(data) {
						snackbar.create("Registro removido com sucesso")
						$scope.data.splice($scope.data.indexOf(cat),1);

					},function(data) {
						console.log(data)
							snackbar.create("Nao foi possivel salvar as alterações: " + data.data.value.error? data.data.value.error: data.statusText)
						
					})
					
				}
				
			}


		}
	])