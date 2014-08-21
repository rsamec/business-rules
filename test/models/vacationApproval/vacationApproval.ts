///<reference path='../../../typings/mocha/mocha.d.ts'/>
///<reference path='../../../typings/node/node.d.ts'/>
///<reference path='../../../typings/underscore/underscore.d.ts'/>
///<reference path='../../../typings/q/q.d.ts'/>
///<reference path='../../../typings/business-rules-engine/business-rules-engine.d.ts'/>

///<reference path='../../../dist/vacationApproval/business-rules.d.ts'/>

var Validation = require('business-rules-engine');
var expect = require('expect.js');
var _:UnderscoreStatic = require('underscore');
import Q = require('q');

var moment = require('moment');
var VacationApproval = require('../../../dist/vacationApproval/node-business-rules.js');
var FakeVacationDeputyService = require('./FakeVacationDeputyService.js');



var addWeekdays =  function (date, days) {
    date = moment(date); // clone
    while (days > 0) {
        date = date.add(1, 'days');
        // decrease "days" only if it's a weekday.
        if (date.isoWeekday() !== 6  && date.isoWeekday() !== 7) {
            days -= 1;
        }
    }
    return date;
};

var addWeekends =  function (date, days) {
    date = moment(date); // clone
    while (days > 0) {
        date = date.add(1, 'days');
        // decrease "days" only if it's a weekday.
        if (date.isoWeekday() === 6 || date.isoWeekday() === 7) {
            days -= 1;
        }
    }
    return date;
};
var firstWeekday = function(days?:number){
    if (days == undefined) days = 0;
    return addWeekdays(new Date(),1).clone().add('days',days).toDate();
}
var firstWeekend = function(days?:number){
    if (days == undefined) days = 0;
    return addWeekends(new Date(),1).clone().add('days',days).toDate();
}

describe('business rules for vacation approval', function () {
    //create test data
    var data;

    //business rules for vacation approval
    var businessRules;

    beforeEach(function () {
        //setup
        data = {};
        businessRules = new VacationApproval.BusinessRules(data, new FakeVacationDeputyService());
    });

    describe('employee', function () {

        describe('first name + last name', function () {

            it('fill no names', function () {
                //when
                data.Employee = {};

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Employee"].Errors["FirstName"].HasErrors).to.equal(true);
                expect(businessRules.Errors.Errors["Employee"].Errors["LastName"].HasErrors).to.equal(true);
            });

            it('fill empty names', function () {
                //when
                data.Employee = {
                    FirstName: '',
                    LastName: ''
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Employee"].Errors["FirstName"].HasErrors).to.equal(true);
                expect(businessRules.Errors.Errors["Employee"].Errors["LastName"].HasErrors).to.equal(true);
            });

            it('fill long names', function () {
                //when
                data.Employee = {
                    FirstName: 'too looooooooooooong first name',
                    LastName: 'too looooooooooooong last name'
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Employee"].Errors["FirstName"].HasErrors).to.equal(true);
                expect(businessRules.Errors.Errors["Employee"].Errors["LastName"].HasErrors).to.equal(true);
            });

            it('fill some names', function () {
                //when
                data.Employee = {
                    FirstName: 'John',
                    LastName: 'Smith'
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Employee"].Errors["FirstName"].HasErrors).to.equal(false);
                expect(businessRules.Errors.Errors["Employee"].Errors["LastName"].HasErrors).to.equal(false);
            });
        });
    });

    describe('duration', function () {

        describe('from and to fields', function () {
            it('fill no dates', function () {
                //when
                data.Duration = {};

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Duration"].Errors["From"].HasErrors).to.equal(true);
                expect(businessRules.Errors.Errors["Duration"].Errors["To"].HasErrors).to.equal(true);
            });


            it('fill empty dates', function () {
                //when
                //when
                data.Duration = {
                    From: '',
                    To: ''
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Duration"].Errors["From"].HasErrors).to.equal(true);
                expect(businessRules.Errors.Errors["Duration"].Errors["To"].HasErrors).to.equal(true);
            });

            it('fill dates before today', function () {
                //when
                //when
                data.Duration = {
                    From: firstWeekday(-4),
                    To: firstWeekday(-4)
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Duration"].Errors["From"].HasErrors).to.equal(true);
                expect(businessRules.Errors.Errors["Duration"].Errors["To"].HasErrors).to.equal(true);
            });

            it('fill dates qreater than one year from today', function () {
                //when
                //when
                data.Duration = {
                    From: firstWeekday(367),
                    To: firstWeekday(367)
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Duration"].Errors["From"].HasErrors).to.equal(true);
                expect(businessRules.Errors.Errors["Duration"].Errors["To"].HasErrors).to.equal(true);
            });


            it('fill today', function () {
                //when
                //when
                data.Duration = {
                    From: firstWeekday(),
                    To: firstWeekday()

                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Duration"].Errors["From"].HasErrors).to.equal(false);
                expect(businessRules.Errors.Errors["Duration"].Errors["To"].HasErrors).to.equal(false);
            });

            it('fill one year from today', function () {
                //when
                //when
                data.Duration = {
                    From: addWeekdays(firstWeekday(360),1).clone().toDate(),
                    To:addWeekdays(firstWeekday(360),1).clone().toDate()
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Duration"].Errors["From"].HasErrors).to.equal(false);
                expect(businessRules.Errors.Errors["Duration"].Errors["To"].HasErrors).to.equal(false);
            });

            it('fill weekend', function () {
                //when
                //when
                data.Duration = {
                    From: firstWeekend(),
                    To: firstWeekend()

                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Duration"].Errors["From"].HasErrors).to.equal(true);
                expect(businessRules.Errors.Errors["Duration"].Errors["To"].HasErrors).to.equal(true);
            });
        });

        describe('duration in days', function () {

            it('zero duration', function () {
                //when
                //when
                data.Duration = {
                    From: firstWeekday(),
                    To: firstWeekday()
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Duration"].Errors["VacationDuration"].HasErrors).to.equal(false);
                expect(businessRules.Duration.VacationDaysCount).to.equal(1);
            });

            it('negative duration', function () {
                //when
                //when
                data.Duration = {
                    From: firstWeekday(),
                    To: firstWeekday(-1)
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Duration"].Errors["VacationDuration"].HasErrors).to.equal(true);
                expect(businessRules.Duration.VacationDaysCount).to.equal(0);

            });

            it('minimal duration', function () {
                //when
                //when
                data.Duration = {
                    From: firstWeekday(),
                    To: firstWeekday()
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Duration"].Errors["VacationDuration"].HasErrors).to.equal(false);
                expect(businessRules.Duration.VacationDaysCount).to.equal(1);
            });

            it('maximal duration 25 days (25 + 10 weekends)', function () {
                //when
                //when
                data.Duration = {
                    From: firstWeekday(),
                    To: firstWeekday(34)
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Duration"].Errors["VacationDuration"].HasErrors).to.equal(false);
                expect(businessRules.Duration.VacationDaysCount).to.equal(25);
            });

            it('too big duration 26 days (26 + 10 weekends)', function () {
                //when
                //when
                data.Duration = {
                    From: firstWeekday(),
                    To: firstWeekday(35)
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Duration"].Errors["VacationDuration"].HasErrors).to.equal(true);
                expect(businessRules.Duration.VacationDaysCount).to.equal(26);
            });

            it('too big duration 26 days (26 + 10 weekends)', function () {
                //when
                //when
                data.Duration = {
                    From: firstWeekday(),
                    To: firstWeekday(105)
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Duration"].Errors["VacationDuration"].HasErrors).to.equal(true);
                expect(businessRules.Duration.VacationDaysCount).to.equal(105);
            });
        });

        describe('excluded days are in duration range', function(){

            it('is in of duration range', function () {
                //when
                //when
                data.Duration = {
                    From: firstWeekday(),
                    To: firstWeekday(5),
                    ExcludedDays: [firstWeekday()]
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Duration"].Errors["VacationDuration"].HasErrors).to.equal(false);
            });

            it('is one out of duration range', function () {
                //when
                //when
                data.Duration = {
                    From: firstWeekday(),
                    To: firstWeekday(1),
                    ExcludedDays: [firstWeekday(2)]
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Duration"].Errors["VacationDuration"].HasErrors).to.equal(true);
            });
            it('is more than one out of duration range', function () {
                //when
                //when
                data.Duration = {
                    From: firstWeekday(),
                    To: firstWeekday(1),
                    ExcludedDays: [firstWeekday(),firstWeekday(1),firstWeekday(2),firstWeekday(3)]
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Duration"].Errors["VacationDuration"].HasErrors).to.equal(true);
            });
        })
    });

    describe('deputy', function () {

        describe('first name + last name', function () {

            it('fill no names', function () {
                //when
                data.Deputy1 = {};

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Deputy1"].Errors["FirstName"].HasErrors).to.equal(true);
                expect(businessRules.Errors.Errors["Deputy1"].Errors["LastName"].HasErrors).to.equal(true);
            });

            it('fill empty names', function () {
                //when
                data.Deputy1 = {
                    FirstName: '',
                    LastName: ''
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Deputy1"].Errors["FirstName"].HasErrors).to.equal(true);
                expect(businessRules.Errors.Errors["Deputy1"].Errors["LastName"].HasErrors).to.equal(true);
            });

            it('fill long names', function () {
                //when
                data.Deputy1 = {
                    FirstName: 'too looooooooooooong first name',
                    LastName: 'too looooooooooooong last name'
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Deputy1"].Errors["FirstName"].HasErrors).to.equal(true);
                expect(businessRules.Errors.Errors["Deputy1"].Errors["LastName"].HasErrors).to.equal(true);
            });

            it('fill some names', function () {
                //when
                data.Deputy1 = {
                    FirstName: 'John',
                    LastName: 'Smith'
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Deputy1"].Errors["FirstName"].HasErrors).to.equal(false);
                expect(businessRules.Errors.Errors["Deputy1"].Errors["LastName"].HasErrors).to.equal(false);
            });
        });

        describe('email', function () {

            it('fill no email', function () {
                //when
                data.Deputy1 = {};

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Deputy1"].Errors["Email"].HasErrors).to.equal(true);
            });

            it('fill wrong email', function () {
                //when
                data.Deputy1 = {
                    Email: 'jsmith.com'
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Deputy1"].Errors["Email"].HasErrors).to.equal(true);
            });

            it('fill some email', function () {
                //when
                data.Deputy1 = {
                    Email: 'jsmith@gmail.com'
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Deputy1"].Errors["Email"].HasErrors).to.equal(false);
            });
        });
    });

    describe('deputy check with list of all approved vacations that they are not in conflict', function () {

        it('fill employee with vacation and confict in days', function (done) {
            //when
            data.Deputy1 = {
                FirstName: 'John',
                LastName: 'Smith'
            };

            data.Duration = {
                From: new Date(),
                To: moment(new Date()).add({ days: 1 }).toDate()
            }

            //exec
            var promiseResult = businessRules.Validate();


            promiseResult.then(function (response) {

                //verify
                expect(businessRules.Errors.Errors["DeputyConflict"].HasError).to.equal(true);

                done();

            }).done(null, done);


        });

        it('fill employee with vacation and confict in days', function (done) {
            //when
            data.Deputy1 = {
                FirstName: 'John',
                LastName: 'Smith'
            };

            data.Duration = {
                From: moment(new Date()).add({ days: 2 }).toDate(),
                To: moment(new Date()).add({ days: 3 }).toDate()
            }

            //exec
            var promiseResult = businessRules.Validate();


            promiseResult.then(function (response) {

                //verify
                expect(businessRules.Errors.Errors["DeputyConflict"].HasError).to.equal(false);

                done();

            }).done(null, done);
        });

    });

    describe('complex test', function () {

        it('fill all fields correctly', function (done) {
            //when
            data = {
                Employee: {
                    FirstName: 'John',
                    LastName: 'Smith'
                },
                Deputy1 : {
                    FirstName: 'Paul',
                    LastName: 'Neuzil',
                    Email:'pneuman@gmai.com'
                },
                Duration : {
                    From : firstWeekday(),
                    To: firstWeekday()
                },
                Approval:{
                    ApprovedBy:{
                        FirstName: 'John',
                        LastName: 'Conrad',
                        Email: 'ppp@gmail.com'
                    }
                }
            };

            businessRules = new VacationApproval.BusinessRules(data, new FakeVacationDeputyService());

            //exec
            var promiseResult = businessRules.Validate();

            promiseResult.then(function (response) {

                //verify
                //console.log(businessRules.Errors.ErrorMessage);
                expect(businessRules.Errors.HasErrors).to.equal(false);

                done();

            }).done(null, done);

        });

        it('fill no fields correctly', function (done) {
            //when
            data = {};

            businessRules = new VacationApproval.BusinessRules(data, new FakeVacationDeputyService());

            //exec
            var promiseResult = businessRules.Validate();

            promiseResult.then(function (response) {

                //verify
                //console.log(businessRules.Errors.ErrorMessage);
                expect(businessRules.Errors.HasErrors).to.equal(true);

                done();

            }).done(null, done);

        });
    });

    describe('approved by', function () {

        describe('first name + last name', function () {

            it('fill no names', function () {
                //when
                data.Approval = {
                    ApprovedBy: {

                    }
                };

                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Approval"].Errors["ApprovedBy"].Errors["FirstName"].HasErrors).to.equal(true);
                expect(businessRules.Errors.Errors["Approval"].Errors["ApprovedBy"].Errors["LastName"].HasErrors).to.equal(true);
            });

            it('fill empty names', function () {
                //when
                data.Approval = {
                    ApprovedBy: {
                        FirstName: '',
                        LastName: ''
                    }
                };

                //exec
                businessRules.Validate();


                //verify
                expect(businessRules.Errors.Errors["Approval"].Errors["ApprovedBy"].Errors["FirstName"].HasErrors).to.equal(true);
                expect(businessRules.Errors.Errors["Approval"].Errors["ApprovedBy"].Errors["LastName"].HasErrors).to.equal(true);
                ;
            });

            it('fill long names', function () {
                //when
                data.Approval = {
                    ApprovedBy: {
                        FirstName: 'too looooooooooooong first name',
                        LastName: 'too looooooooooooong last name'
                    }
                };


                //exec
                businessRules.Validate();

                //verify
                expect(businessRules.Errors.Errors["Approval"].Errors["ApprovedBy"].Errors["FirstName"].HasErrors).to.equal(true);
                expect(businessRules.Errors.Errors["Approval"].Errors["ApprovedBy"].Errors["LastName"].HasErrors).to.equal(true);
            });

            it('fill some names', function () {
                //when
                data.Approval = {
                    ApprovedBy: {
                        FirstName: 'John',
                        LastName: 'Smith'
                    }
                };

                //exec
                businessRules.Validate();

                //verify
                //verify
                expect(businessRules.Errors.Errors["Approval"].Errors["ApprovedBy"].Errors["FirstName"].HasErrors).to.equal(false);
                expect(businessRules.Errors.Errors["Approval"].Errors["ApprovedBy"].Errors["LastName"].HasErrors).to.equal(false);
            });
        });


        describe('approved date', function () {

            it('approved before vacation starts - no error', function () {
                //when
                data.Duration = {
                    From: firstWeekday(14)
                }
                data.Approval = {
                    ApprovedDate: firstWeekday(7)
                };

                //exec
                businessRules.ValidateApproval();

                //verify
                expect(businessRules.VacationApprovalErrors["ApprovedByLessThanEqualFrom"].HasErrors).to.equal(false);
            });

            it('approved after vacation starts - error', function () {
                //when
                data.Duration = {
                    From: firstWeekday(0)
                }
                data.Approval = {
                    ApprovedDate: firstWeekday(7)
                };

                //exec
                businessRules.ValidateApproval();

                //verify
                expect(businessRules.VacationApprovalErrors["ApprovedByLessThanEqualFrom"].HasErrors).to.equal(true);
            });

            it('approved the same days as vacation starts - no error', function () {
                //when
                data.Duration = {
                    From: firstWeekday()
                }
                data.Approval = {
                    ApprovedDate: firstWeekday()
                };

                //exec
                businessRules.ValidateApproval();

                //verify
                expect(businessRules.VacationApprovalErrors["ApprovedByLessThanEqualFrom"].HasErrors).to.equal(false);
            });
        });
    });
});

describe('duration days', function () {


    //create test data
    var data;

    //business rules for vacation approval
    var duration;

    beforeEach(function () {
        //setup
        data = {};
        duration = new VacationApproval.Duration({Duration: data});
    });

    describe('range days', function () {

        it('the same days - return 1 day', function () {
            //when
            data.From = new Date(), data.To = new Date();

            //verify
            expect(duration.RangeDaysCount).to.equal(1);
        });

        it('positive range - number of days ', function () {
            //when
            data.From = new Date(), data.To = moment(new Date()).add('days', 1).toDate();

            //verify
            expect(duration.RangeDaysCount).to.equal(2);
        });

        it('negative range - zero day', function () {
            //when
            data.From = new Date(), data.To = moment(new Date()).add('days', -1).toDate();

            //verify
            expect(duration.RangeDaysCount).to.equal(0);
        });
    });
    describe('vacation days - exclude weekends', function () {

        it('positive range - one weekend ', function () {
            //when
            data.From = new Date(), data.To = moment(new Date()).add('days', 6).toDate();

            //verify
            expect(duration.VacationDaysCount).to.equal(5);
        });

        it('negative range - zero day', function () {
            //when
            data.From = new Date(), data.To = moment(new Date()).add('days', -1).toDate();

            //verify
            expect(duration.RangeDaysCount).to.equal(0);
        });

        it('positive range - three weekends ', function () {
            //when
            data.From = new Date(), data.To = moment(new Date()).add('days', 20).toDate();

            //verify
            expect(duration.VacationDaysCount).to.equal(15);
        });
    });


    describe('vacation days - specific exclude - e.g. public holiday', function () {

        it('within weekdays ' + moment(firstWeekday()).format("dddd, MMMM Do YYYY"), function () {
            //when
            data.From = new Date(), data.To = moment(new Date()).add('days', 6).toDate();
            data.ExcludedDays = [firstWeekday()];

            //verify
            expect(duration.VacationDaysCount).to.equal(4);
        });

        it('within weekends ' + moment(firstWeekend()).format("dddd, MMMM Do YYYY"), function () {
            //when
            data.From = new Date(), data.To = moment(new Date()).add('days', 6).toDate();
            data.ExcludedDays = [firstWeekend()];

            //verify
            expect(duration.VacationDaysCount).to.equal(5);
        });

        it('overlaps range', function () {
            //when
            //when
            data.From = new Date(), data.To = moment(new Date()).add('days', 6).toDate();
            data.ExcludedDays = [moment(new Date()).add('days', 20).toDate()];

            //verify
            expect(duration.VacationDaysCount).to.equal(5);
        });
    });

    describe('big date ranges - days without exluding weekends - due to performance', function () {

        it('positive range - 4 years', function () {
            //when
            data.From = new Date(), data.To = moment(new Date()).add('years', 4).toDate();
            //data.ExcludedDays = [firstWeekday()];

            //verify
            expect(duration.VacationDaysCount).to.equal(4 * 365 + 1);
        });

        it('negative range - minus 4 years', function () {
            //when
            data.From = new Date(), data.To = moment(new Date()).add('years', -4).toDate();
            //data.ExcludedDays = [firstWeekday()];

            //verify
            expect(duration.VacationDaysCount).to.equal(0);
        });
    });

});
