'use strict';

var person = {
    id: '42',
    fullName: 'Zaphod Beeblebrox'
};

function validate(person) {

    if (!person.fullName) {
        return {
            statusCode: 400,
            message: 'The person has no name.'
        };
    }

    return null;
}

module.exports = {
    get: function () {
        return person;
    },
    save: function (id, updatedPerson) {
        var errors = validate(updatedPerson);

        if (errors) {
            return errors;
        }

        person = updatedPerson;

        return {};
    }
};
