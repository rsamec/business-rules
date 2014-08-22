///<reference path='../../../typings/mocha/mocha.d.ts'/>
///<reference path='../../../typings/node/node.d.ts'/>
///<reference path='../../../typings/underscore/underscore.d.ts'/>
///<reference path='../../../typings/q/q.d.ts'/>
///<reference path='../../../typings/business-rules-engine/business-rules-engine.d.ts'/>
///<reference path='../../../dist/invoice/business-rules.d.ts'/>

var Validation = require('business-rules-engine');
var expect = require('expect.js');
var _:UnderscoreStatic = require('underscore');
import Q = require('q');

var moment = require('moment');
var Invoice = require('../../../dist/invoice/node-business-rules.js');


describe('business rules for invoice', function () {
    //create test data
    var data;

    //business rules for vacation approval
    var businessRules;

    beforeEach(function () {
        //setup
        data = {};
        businessRules = new Invoice.BusinessRules(data);
    });

    describe('subject', function () {

        describe('items', function () {

            it('fill no item', function () {
                //when
                data.Subject = {
                    Items: []
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.ValidationResult.Errors["Subject"].Errors["AnyItem"].HasErrors).to.equal(true);
            });

            it('fill one item', function () {
                //when
                data.Subject = {
                    Items: [{Work:"some item", Quantity:10 , Price:200.4}]
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.ValidationResult.Errors["Subject"].Errors["AnyItem"].HasErrors).to.equal(false);
            });

        });
    });
});
