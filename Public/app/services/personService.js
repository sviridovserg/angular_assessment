angular.module('assessmentApp.services').factory('personService', ['$http', '$q', function ($http, $q) {
    'use strict';
    function get(id) {
        return $http.get('/api/person/' + id).then(function (result) {
            return result.data;
        });
    }

    function update(person) {
        var defer = $q.defer();
        $http.put('/api/person/' + person.id, person).then(function (result) {
            defer.resolve(result.data);
        }, function (error) {
            defer.reject(error.data);
        });
        return defer.promise;
    }

    return {
        get: get,
        update: update
    };
}]);