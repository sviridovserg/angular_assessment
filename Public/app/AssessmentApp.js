(function (angular) {
    'use strict';
    var app = angular.module('assessmentApp', ['assessmentApp.services', 'assessmentApp.directives']);


    app.controller('PersonController', ['$scope', '$q', 'personService', function ($scope, $q, personService) {
        personService.get(42).then(function (result) {
            $scope.person = result;
        });
        
        $scope.savePerson = function () {
            var defer = $q.defer();
            personService.update($scope.person).then(function () {
                defer.resolve();
            },
            function (error) {
                defer.reject(error.message);
            });
            return defer.promise;
        };
    }]);

}(angular));
