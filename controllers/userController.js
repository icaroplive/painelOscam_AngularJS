'use strict'
app.controller('userCtrl', ['$scope', '$http', 'api', '$filter', '$timeout', 'requestConfig', 'snackbar', '$location', function ($scope, $http, api, $filter, $timeout, requestConfig, snackbar, $location) {
	$scope.location = $location.path();
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
		$http.get(api.url + '/cliente').then(function (data) {
			console.log(data)
			$scope.data = data.data
			$scope.Total = data.data.reduce(function (prev, cur) {
				return prev + cur.cliente.valorCobrado;
			}, 0);
		}, function (data) {
			console.log(data)
		})
	}

	$scope.financeiro = function () {

		$http.get(api.url + '/financeiro', requestConfig.headers).then(function (data) {
			$scope.financeiro = data.data
			$scope.TotalDev = data.data.reduce(function (prev, cur) {
				return prev + cur.valorLogin;

			}, 0);
			$scope.TotalCob = data.data.reduce(function (prev, cur) {
				return prev + cur.valorCobrado;

			}, 0);
			console.log($scope.TotalCob)
		})
	}
	$scope.list();
	$scope.financeiro();

	$scope.editar = function (dados) {
		if (!angular.isUndefined(dados)) {
			$scope.dados = dados;
			$scope.up2 = dados.cliente;
			$scope.up = angular.copy(dados.cliente);
		}
		else {
			$scope.dados = null;
			$scope.up2 = null;
			$scope.up = null;
		}
		$('#modalupload').modal('show');
	}

	function save(form) {
		$http.post(api.url + '/cliente', form, requestConfig.headers).then(function (data) {
			var ew = {
				cliente: {},
				canal: null
			};
			ew.cliente = data.data
			$scope.data.push(ew);
			snackbar.create("Cadastrado com sucesso");
			$('#modalupload').modal('hide');

		})

	}
	function update(form) {
		$http.put(api.url + '/cliente/' + form.id, form, requestConfig.headers).then(function (data) {
			$scope.data[$scope.data.indexOf($scope.dados)].cliente = data.data
			snackbar.create("Dados atualiazdos com sucesso!")
			$('#modalupload').modal('hide');
		})
	}
	$scope.salvar = function (form) {

		if (!form.id) {
			var data = save(form);
		}
		else { var data = update(form); }
	}
	$scope.excluir = function (cat) {
		if (confirm("Deseja excluir o registro de " + cat.cliente.nome + '?')) {

			$http.delete(api.url + '/cliente/' + cat.cliente.id, requestConfig.headers).then(function (data) {
				snackbar.create("Registro removido com sucesso")
				$scope.data.splice($scope.data.indexOf(cat), 1);

			})

		}

	}


}
])