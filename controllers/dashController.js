'use strict'
app.controller('dashCtrl', ['$scope', '$http', 'api', '$filter', '$timeout', 'requestConfig', 'snackbar', '$location', function ($scope, $http, api, $filter, $timeout, requestConfig, snackbar, $location) {
    $scope.location = $location.path();
}
]);