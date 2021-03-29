var app=angular.module("app",["ngRoute", "angularUtils.directives.dirPagination","angular.snackbar","LocalStorageModule"])


app.factory('preventTemplateCache', function($injector) {
  var yourDate = new Date();  // for example

  // the number of .net ticks at the unix epoch
  var epochTicks = 621355968000000000;
  
  // there are 10000 .net ticks per millisecond
  var ticksPerMillisecond = 10000;
  
  // calculate the total number of .net ticks for your date
  var yourTicks = epochTicks + (yourDate.getTime() * ticksPerMillisecond);
return {
      'request': function(config) {
        if (config.url.indexOf('views') !== -1) {
          config.url = config.url + '?t=' + yourTicks;
        }
        return config;
      }
    }
  })
.config(function($httpProvider) {
    $httpProvider.interceptors.push('preventTemplateCache');
  });


app.run(function($rootScope, $templateCache) {
  $rootScope.$on('$viewContentLoaded', function() {
     $templateCache.removeAll();
  });
});

app.config(function($routeProvider){
  $routeProvider
    .when("/", {
      templateUrl:"views/login.html",
	  controller:"loginCtrl"
    })
	.when("/logout", {
	  template: '',
	  controller:"logoutCtrl"
    })
	 .when("/user", {
      templateUrl:"views/user.html",
	  controller:"userCtrl",
    })
    .when("/dash", {
      templateUrl:"views/dash.html",
	  controller:"dashCtrl",
    })
	.when("/parametros", {
      templateUrl:"views/parametros.html",
	  controller:"parametrosCtrl",
    })
	.when("/financeiro", {
	  templateUrl:"views/financeiro.html",
	  controller:"financeiroCtrl"
    })
    .otherwise({redirectTo: '/'});
});
app.constant('api', {
    url: "http://apipainel.ipr.net.br/api"
	//url: "http://localhost:5000/api"
});
app.constant('requestConfig', {
	headers : {withCredentials: false}
	// headers: {"authorization": `Bearerx eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0ZUB0ZXN0ZS5jb20iLCJqdGkiOiI2MzQ5NDkxYi05Njk1LTRjNTMtYTQwMy0yNTkxZGUyMGI1MTQiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjcxMjY5MDBkLTE0OWMtNGQ0Zi1hOTc0LTkwMTI0M2Y5NjU2MSIsImV4cCI6MTUzNzAzMjkzMSwiaXNzIjoiaHR0cDovL3lvdXJkb21haW4uY29tIiwiYXVkIjoiaHR0cDovL3lvdXJkb21haW4uY29tIn0.TeqCOHt1OlKpuEdvxRGyhzpXthVbXL4UWDEwAD_XD4g`}
    
});

/*angular.module('app', [])
  .factory('AuthService', AuthService);

function AuthService ($http, $localStorage, $q) {
  return {
    getToken : function () {
      return $localStorage.token;
    },
    setToken: function (token) {
      $localStorage.token = token;
    },
    signin : function (data) {
      $http.post('api/signin', data);
    },
    signup : function (data) {
      $http.post('api/signup', data);
    },
    logout : function (data) {
      delete $localStorage.token;
      $q.when();
    }
  };
}*/


app.service('AuthService',['localStorageService','api',function(localStorageService,api,$q,$http) {
	return {
    getToken : function () {
       return localStorageService.get('token');
    },
    setToken: function (token) {
      localStorageService.set('token',token);
    },
    signin : function (data) {
      $http.post(api.url + 'api/signin', data);
    },
    signup : function (data) {
      $http.post(api.url + '/Account/login', data);
    },
    logout : function () {
      localStorageService.remove('token');;
      //$q.when();
    }
  };
	
}])
//app.factory('AuthService', AuthService);
app.factory('AuthInterceptor', AuthInterceptor)
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });
function AuthInterceptor($q, $rootScope, $location,snackbar,AuthService) {
	return {
		request: function(config) {
			
      config.headers = config.headers || {};
      if (AuthService.getToken()) {
        config.headers['Authorization'] = 'Bearer ' + AuthService.getToken().token;
      }

      return config;
    },
        responseError: function(rejection) {
            if (rejection.status === 401 || rejection.status === 403) {
				$location.path('/login');
				//snackbar.create("Faça login para continuar");
            }
			else {
				console.log(rejection && rejection.data && rejection.data.value && rejection.data.value.error)
				snackbar.create(rejection && rejection.data && rejection.data.value && rejection.data.value.error || "Falha na comunicação ");
			}
            return $q.reject(rejection);
        }
    };
}


app.run(function ($rootScope, $location, AuthService) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      if (next.authorize) {
        if (!AuthService.getToken()) {
          /* Ugly way
          event.preventDefault();
          $location.path('/login');
          ========================== */

          $rootScope.$evalAsync(function () {
            $location.path('/login');
          })
        }
      }
    });

  })

app.directive('activeLink', function($location) {

    var link = function(scope, element, attrs) {
        scope.$watch(function() { return $location.path(); }, 
        function(path) {
            var url = element.find('a').attr('href');
            if (url) {
                url = url.substring(1);
            }

            if (path == url) {
                element.addClass("active");
            } else {
                element.removeClass('active');
            }

        });
    };

    return {
        restrict: 'A',
        link: link
    };
});

