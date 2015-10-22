angular.module('assessmentApp.directives').directive('asmtCustomInput', function () {
    'use strict';
    return {
        restrict: 'E',
        templateUrl: 'App/directives/customInput/customInput.html',
        scope: {
            value: '=ngModel',
            save: '&'
        },
        controller: ['$scope', function ($scope) {
            $scope.isEditMode = false;
            $scope.error = '';
            var initialValue = null;

            $scope.edit = function () {
                initialValue = $scope.value;
                $scope.isEditMode = true;
            };

            $scope.saveChanges = function () {
                var savePromise = $scope.save();
                if (savePromise) {
                    savePromise.then(function () {
                        $scope.isEditMode = false;
                    }, function (error) {
                        $scope.error = error;
                    });
                }
            };

            $scope.cancelChanges = function () {
                $scope.isEditMode = false;
                $scope.value = initialValue;
            };

            $scope.$watch('value', function () {
                $scope.error = '';
            });
        }]
    };
});