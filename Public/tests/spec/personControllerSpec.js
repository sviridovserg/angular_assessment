describe('PersonController', function () {
    var $rootScope,
        $q,
        createController,
        personService;

    beforeEach(function () {
        module('assessmentApp');
    });

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        var $controller = $injector.get('$controller');
        $q = $injector.get('$q');

        personService = {
        };
        createController = function () {
            return $controller('PersonController', { '$scope': $rootScope, 'personService': personService });
        };
    }));

    it('should call personService get on initialize', function () {
        personService.get = jasmine.createSpy('getPerson').and.returnValue({ then: function () { } });
        createController();
        expect(personService.get).toHaveBeenCalled();
    });

    it('should set person info after it come from service', function () {
        personService.get = function () {
            var defer = $q.defer();
            defer.resolve({ id: 1, fullName: 'Test' });
            return defer.promise;
        }
        createController();
        $rootScope.$apply();
        expect($rootScope.person).not.toBeNull();
        expect($rootScope.person.id).toEqual(1);
        expect($rootScope.person.fullName).toEqual('Test');
    });

    describe('save ', function () {
        beforeEach(function () {
            personService.get = function () {
                var defer = $q.defer();
                defer.resolve({ id: 1, fullName: 'Test' });
                return defer.promise;
            }
        });

        it('should call personSerivce update function', function () {
            personService.update = jasmine.createSpy('updatePerson').and.returnValue({ then: function () { } });
            createController();
            $rootScope.$apply();
            $rootScope.savePerson();
            expect(personService.update).toHaveBeenCalledWith({ id: 1, fullName: 'Test' });
        });

        it('successsful should resolve promise', function () {
            personService.update = function () {
                var defer = $q.defer();
                defer.resolve();
                return defer.promise;
            }
            createController();
            var saved = jasmine.createSpy('saved');
            $rootScope.savePerson().then(saved);
            $rootScope.$apply();
            expect(saved).toHaveBeenCalled();
        });

        it('failed should reject promise with error message', function () {
            personService.update = function () {
                var defer = $q.defer();
                defer.reject({ message: 'Error' });
                return defer.promise;
            }
            createController();
            var failed = jasmine.createSpy('saved');
            $rootScope.savePerson().then(null, failed);
            $rootScope.$apply();
            expect(failed).toHaveBeenCalledWith('Error');
        })
    })
    
});