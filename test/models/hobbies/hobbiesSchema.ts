///<reference path='../../../typings/mocha/mocha.d.ts'/>
///<reference path='../../../typings/node/node.d.ts'/>
///<reference path='../../../typings/underscore/underscore.d.ts'/>
///<reference path='../../../typings/q/q.d.ts'/>
///<reference path='../../../typings/business-rules-engine/business-rules-engine.d.ts'/>
///<reference path='../../../dist/hobbies/business-rules.d.ts'/>

var Validation = require('business-rules-engine');
var FormSchema = require('business-rules-engine/commonjs/FormSchema');
var expect = require('expect.js');
var _:UnderscoreStatic = require('underscore');
import Q = require('q');

var Hobbies = require('../../../dist/hobbies/node-business-rules.js');
//create test data

var sharedHobbiesTest = function(abstractValidator) {
    var data;
    var businessRules;
    beforeEach(function () {
        //setup
        data = {};
        businessRules = abstractValidator.CreateRule("Main");
    });
    describe('hobbies', function () {

        describe('first name + last name', function () {

            it('fill no names', function () {
                //when

                //exec
                var result = businessRules.Validate(data);

                //verify
                expect(result.Errors["Person"].Errors["FirstName"].HasErrors).to.equal(true);
                expect(result.Errors["Person"].Errors["LastName"].HasErrors).to.equal(true);
            });

            it('fill empty names', function () {
                //when
                data.Person = {
                    FirstName: '',
                    LastName: ''
                };
                //exec
                var result = businessRules.Validate(data);

                //verify
                expect(result.Errors["Person"].Errors["FirstName"].HasErrors).to.equal(true);
                expect(result.Errors["Person"].Errors["LastName"].HasErrors).to.equal(true);
            });

            it('fill long names', function () {
                //when
                data.Person = {
                    FirstName: 'too looooooooooooong first name',
                    LastName: 'too looooooooooooong last name'
                };

                //exec
                var result = businessRules.Validate(data);

                //verify
                expect(result.Errors["Person"].Errors["FirstName"].HasErrors).to.equal(true);
                expect(result.Errors["Person"].Errors["LastName"].HasErrors).to.equal(true);
            });

            it('fill some names', function () {
                //when
                data.Person = {
                    FirstName: 'John',
                    LastName: 'Smith'
                };

                //exec
                var result = businessRules.Validate(data);

                //verify
                expect(result.Errors["Person"].Errors["FirstName"].HasErrors).to.equal(false);
                expect(result.Errors["Person"].Errors["LastName"].HasErrors).to.equal(false);
            });
        });

        describe('email', function () {


            it('fill no email', function () {
                //when
                data = {Person: {Contact: {}}};

                //exec
                var result = businessRules.Validate(data);

                //verify
                expect(result.Errors["Person"].Errors["Contact"].Errors["Email"].HasErrors).to.equal(true);
            });

            it('fill wrong email', function () {
                //when
                data = {
                    Person: { Contact: {
                        Email: 'jsmith.com' }
                    }
                };

                //exec
                var result = businessRules.Validate(data);

                //verify
                expect(result.Errors["Person"].Errors["Contact"].Errors["Email"].HasErrors).to.equal(true);
            });

            it('fill some email', function () {
                //when
                data = {
                    Person: { Contact: {
                        Email: 'jsmith@gmail.com' }
                    }
                };

                //exec
                var result = businessRules.Validate(data);

                //verify
                expect(result.Errors["Person"].Errors["Contact"].Errors["Email"].HasErrors).to.equal(false);
            });
        });

        describe('items', function () {

            it('fill no item', function () {
                //when
                data.Hobbies = [];

                //exec
                var result = businessRules.Validate(data);

                //verify
                expect(result.Errors["Hobbies"].HasErrors).to.equal(true);
            });

            it('fill two items', function () {
                //when
                data.Hobbies = [
                    {HobbyName: "Skiing"},
                    {HobbyName: 'Chess'}
                ]

                //exec
                var result = businessRules.Validate(data);

                //verify
                expect(result.Errors["Hobbies"].HasErrors).to.equal(false)
            });

            it('fill five items', function () {
                //when
                data.Hobbies = [
                    {HobbyName: "Skiing"},
                    {HobbyName: 'Chess'},
                    {HobbyName: "Skiing 2"},
                    {HobbyName: 'Chess 2'},
                    {HobbyName: "Skiing 3"}
                ]

                //exec
                var result = businessRules.Validate(data);

                //verify
                expect(result.Errors["Hobbies"].HasErrors).to.equal(true)
            });

        });
    });
}

describe('API', function () {

    sharedHobbiesTest(new Hobbies.BusinessRules({}).MainAbstractRule);

});

describe('JSON schema validation for hobbies', function () {

    var hobbiesSchema = {
        Person: {
            type: "object",
            properties: {
                FirstName: { type: "string", title: "First name", required: true, maxLength: 15 },
                LastName: { type: "string", title: "Last name", required: true, maxLength: 15 },
                Contact: {
                    type: "object",
                    properties: {
                        Email: {
                            type: "string", title: "Email",
                            required: true,
                            maxLength: 100,
                            email: true
                        }
                    }
                }
            }
        },
        Hobbies: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    HobbyName: { type: "string", title: "HobbyName", required: true, maxLength: 100 },
                    Frequency: { type: "string", title: "Frequency", enum: ["Daily", "Weekly", "Monthly"] },
                    Paid: { type: "boolean", title: "Paid" },
                    Recommedation: { type: "boolean", title: "Recommedation" }
                }
            },
            maxItems: 4,
            minItems: 2
        }
    };

    sharedHobbiesTest(new FormSchema.JsonSchemaRuleFactory(hobbiesSchema));

});

describe('raw data JSON annotated with meta data rules', function () {

    var hobbiesSchema = {
        Person: {
            FirstName: {
                rules: {required: true, maxlength: 15}
            },
            LastName: {
                rules: { required: true, maxlength: 15 }
            },
            Contact: {
                Email: {
                    rules: {
                        required: true,
                        maxlength: 100,
                        email: true
                    }
                }
            }
        },
        Hobbies: [
            {
                HobbyName: {
                    rules: { required: true, maxlength: 100 }
                },
                Frequency: {
                    rules: { enum: ["Daily", "Weekly", "Monthly"]
                    }
                }},
            { maxItems: 4, minItems: 2}
        ]
    };

    sharedHobbiesTest(new FormSchema.JQueryValidationRuleFactory(hobbiesSchema));

});
