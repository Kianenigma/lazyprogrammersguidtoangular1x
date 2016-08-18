var myApp = angular.module('myApp', ['ngRoute']);


myApp.factory("customInterceptor", function ($q) {
  return {
    request: function (config) {
      console.log('request : ', config);
      return config
    },
    response: function (response) {
      console.log('response', response);
      return response
    },
    responseError: function (response) {
      // to test things, we pass the responseError to
      // success callbacl by calling resolve
      console.log('responseError', response);
      return $q.resolve(response);
    }
  }
})

myApp.run(function ($rootScope) {
  $rootScope.$on("$routeChangeSuccess", function (evt) {
    console.log(evt);
  })
})


myApp.config(function ($httpProvider, $routeProvider, $locationProvider) {
  $httpProvider.interceptors.push('customInterceptor');

  $routeProvider
    .when("/", {
      templateUrl: "/view/home.html",
      controller: 'mainCtrl'
    })
    .when("/github/:username", {
      templateUrl: "/view/github.html",
      controller: "githubCtrl",
      resolve: {
        repo: function ($q, $timeout) {
          var defer = $q.defer();
          $timeout(function () {
            defer.resolve({ data: 'data' })
          }, 3000)
          return defer.promise;
        }
      }
    })
    .when("/about", {
      templateUrl: "/view/about.html"
    })

  .otherwise({
    redirectTo: '/'
  })

  // $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false
  // });
})


myApp.controller('mainCtrl', function ($scope, $timeout, $http, $route) {
  $scope.Title = 'Chapter 4 starts now!';


  $scope.actors = {
    "Ted": {
      lastName: "Mosbey",
      age: 27,
      bars: ["Blind Tiger", "Torst", "Good Beer"]
    },
    "Barney": {
      lastName: "Stinson",
      age: 30,
      bars: ["The Poney Bar"]
    },
    "Robin": {
      lastName: "Scherbatsky",
      age: 26,
      bars: ["Blind Tiger", "Torst", "Good Beer"]
    },
    "Lily": {
      lastName: "Aldrin",
      age: 27,
      bars: ["Blind Tiger", "Torst"]
    }
  }

  $scope.classes = ["btn-xs btn-danger"]

  $scope.sayHi = function () {
    alert('hello there');
  }

  // STYLE Manipulation
  $scope.btnDisplay = true;
  $scope.iconDisplay = false;

  $scope.doProcess = function () {
    $scope.iconDisplay = true;
    $timeout(function () { $scope.btnDisplay = false }, 3000);
  }
  $scope.classes = ["btn-xs btn-danger"]
    //

  // FORMS
  $scope.submit = function (form) {
    console.log(form);
    console.log(form.email.$error);
  }

  $scope.minpwd = 3;

  // HTTP

  // WATCH
  $scope.repos = [];
  $scope.reqStatus = 0;
  // 0 = success
  // 1 = req sent
  // 2 = error
  $scope.$watch("username", function (n, o) {
      if (n) {
        $scope.reqStatus = 1;
        var httpPromise = $http({
            method: 'GET',
            url: 'https://api.github.com/users/' + n + '/repos',
          })
          .then(function (response) {
            $scope.reqStatus = 0;
            $scope.$broadcast("repo_update", {
              status: true,
              repos: response.data
            })
          }, function (err) {
            $scope.reqStatus = 2;
            $scope.$broadcast("repo_update", {
              status: true,
              repos: null
            })
          })
      } // end of if
    }) // end of $watch

});

myApp.controller('repoListCtrl', function ($scope, $rootScope) {
  $scope.repos = [];

  $rootScope.data = "root is here:|"

  $scope.$on('repo_update', function (evt, args) {
    console.log(args);
    if (args.status) {
      $scope.repos = args.repos;
    } else {
      $scope.repos = [];
    }
  })
})

myApp.controller('githubCtrl', function ($scope, $location, $route, $routeParams, repo) {
  console.log($route.current);
  console.log(repo);
  console.log($routeParams);
  $scope.homePath = function () {
    $location.path('/');
  }
})

myApp.filter('strRev', function () {
  return function (inp) {
    return inp.split('').reverse().join('')
  }
})