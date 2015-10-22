describe('personService', function () {
    var personService,
        $httpBackend;
    beforeEach(function () {
        module('assessmentApp.services');
    });

    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        personService = $injector.get('personService');
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should return person data to caller', function () {
        $httpBackend.expectGET('/api/person/1').respond(200, { fullName: 'Test', id: 1 });
        personService.get(1).then(function (person) {
            expect(person).not.toBeNull();
            expect(person.fullName).toEqual('Test');
            expect(person.id).toEqual(1);
        });
        $httpBackend.flush();
    });

    it('should send update request on update', function () {
        $httpBackend.expect('PUT', '/api/person/1', { fullName: 'Test', id: 1 }).respond(200);
        var executed = jasmine.createSpy('requestExecuted');
        personService.update({ fullName: 'Test', id: 1 }).then(executed);
        $httpBackend.flush();
        expect(executed).toHaveBeenCalled();
    })

    it('should return error to caller if update failed', function () {
        $httpBackend.expect('PUT', '/api/person/1', { fullName: 'Test', id: 1 }).respond(400, { message: 'Error', statusCode: 400, });
        personService.update({ fullName: 'Test', id: 1 }).then(null, function (error) {
            expect(error.message).toEqual('Error')
            expect(error.statusCode).toEqual(400);
        });
        $httpBackend.flush();
    });
});