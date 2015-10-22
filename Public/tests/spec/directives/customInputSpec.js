describe('customInput', function () {
    var $scope,
        element,
        directiveScope;

    beforeEach(function () {
        module('assessmentApp');
    });

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        var $compile = _$compile_;
        var $rootScope = _$rootScope_;

        $scope = $rootScope.$new();

        $scope.name = 'Test Name';
        element = $compile('<asmt-custom-input ng-model="name" save="save()"></asmt-custom-input>')($scope);
        $scope.$digest();

        directiveScope = element.isolateScope();
        directiveScope.$apply();
    }));

    it('should initialize with binded value', function () {
        expect(directiveScope.value).toEqual('Test Name');
        expect(element[0].querySelectorAll('#ci-label')[0].innerText).toEqual('Test Name');
    });

    it('should initialize in readonly mode', function () {
        expect(directiveScope.isEditMode).toBeFalsy();
    });

    it('should switch to edit mode on edit', function () {
        element[0].querySelectorAll('#ci-edit')[0].click();
        expect(directiveScope.isEditMode).toBeTruthy();
    })
    
    describe('in edit mode ', function () {
        beforeEach(function () {
            element[0].querySelectorAll('#ci-edit')[0].click();
        });

        it('should revert changes on cancel', function () {
            var input = element[0].querySelectorAll('.ci-input input')[0];
            input.value = 'New Name';
            event = document.createEvent("HTMLEvents");
            event.initEvent("input", true, true);
            input.dispatchEvent(event);
            directiveScope.$apply();
            expect(directiveScope.value).toEqual('New Name');
            element[0].querySelectorAll('#ci-cancel')[0].click();
            expect(directiveScope.value).toEqual('Test Name');
        });

        it('should call save callback on save', function () {
            $scope.save = jasmine.createSpy('saveCallback');
            $scope.$apply();
            element[0].querySelectorAll('#ci-save')[0].click();
            expect($scope.save).toHaveBeenCalled();
        });

        describe('if save ', function () {
            var $q,
                defer;
            
            beforeEach(inject(function (_$q_) {
                $q = _$q_;
            }));

            beforeEach(function () {
                defer = $q.defer();
                $scope.save = function () {
                    return defer.promise;
                };
                $scope.$apply();
                element[0].querySelectorAll('#ci-save')[0].click();
            });

            it('successfull should switch to readonly mode', function () {
                defer.resolve();
                $scope.$apply();
                expect(directiveScope.isEditMode).toBeFalsy();
            });

            it('failed should show error', function () {
                defer.reject('Error');
                $scope.$apply();
                expect(directiveScope.error).toEqual('Error');
                expect(element[0].querySelectorAll('.ci-inline-validation-text')[0].title).toEqual('Error');
            });

            it('failed should stay in edit mode', function () {
                defer.reject('Error');
                $scope.$apply();
                expect(directiveScope.isEditMode).toBeTruthy();
            });
        })

    });
    
});