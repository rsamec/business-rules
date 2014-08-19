vacationApproval
==============

Business rules for vacation approval. Vacation request validation rules:

+   employee
    +   name -> first name + last name is required
+   duration
    +   from and to is required
    +   from and to must be valid dates (expect weekends)
    +   from and to must be greater or equal today
    +   from and to must be less or equal 1 year
    +   from must be equal or before to field
    +   minimal duration (without excluded days) is 1 day
    +   maximal duration (without excluded days) is 25 days
    +   excluded days - must be in range given by from and to
+   deputy
    +   first name + last name of deputy is required
    +   contact (email) is required
    +   can not select deputy have approved vacation at the same days (async)
+   at least one deputy is required -> second deputy is optional


## Basic usage

```typescript
import moment = require('moment');
import _ = require('underscore');
import Validation = require('node-form');
import VacationApproval = require('./models/vacationApproval/node-business-rules.js');

//create test data
var data:VacationApproval.IVacationApprovalData = {
                Employee: {
                    FirstName: 'John',
                    LastName: 'Smith toooooooooooooooooooooooooo long'
                },
                Deputy1: {
                    Checked:true,
                    FirstName: 'Paul',
                    LastName: 'Neuman',
                    Email: 'pneuman@gmai.com'
                },
                Duration: {
                    From: new Date(),
                    To: moment(new Date()).add('days', 1).toDate()
                }
            };


//business rules for vacation approval
var businessRules = new VacationApproval.BusinessRules(data);

//execute validation
businessRules.Validate();

//verify and display results
if (businessRules.Errors.HasErrors) console.log(businessRules.Errors.ErrorMessage);
```

Output
```bash
Please enter no more than 15 characters.
```

## Tests

Output of all business rules for vacation are under tests.

```bash
   employee
       first name + last name
         √ fill no names
         √ fill empty names
         √ fill long names
         √ fill some names
     duration
       from and to fields
         √ fill no dates
         √ fill empty dates
         √ fill dates before today
         √ fill dates qreater than one year from today
         √ fill today
         √ fill one year from today
         √ fill weekend
       duration in days
         √ zero duration
         √ negative duration
         √ minimal duration
         √ maximal duration 25 days (25 + 10 weekends)
         √ too big duration 26 days (26 + 10 weekends)
         √ too big duration 26 days (26 + 10 weekends)
       excluded days are in duration range
         √ is in of duration range
         √ is one out of duration range
         √ is more than one out of duration range
     deputy
       first name + last name
         √ fill no names
         √ fill empty names
         √ fill long names
         √ fill some names
       email
         √ fill no email
         √ fill wrong email
         √ fill some email
     deputy check with list of all approved vacations that they are not in conflict
       √ fill employee with vacation and confict in days (1022ms)
       √ fill employee with vacation and confict in days (1025ms)
     complex test

       √ fill all fields correctly (1027ms)
     approved by
       first name + last name
         √ fill no names
         √ fill empty names
         √ fill long names
         √ fill some names
       approved date
         √ approved before vacation starts - no error
         √ approved after vacation starts - error
         √ approved the same days as vacation starts - no error

   duration days
     range days
       √ the same days - return 1 day
       √ positive range - number of days
       √ negative range - zero day
     vacation days - exclude weekends
       √ positive range - one weekend
       √ negative range - zero day
       √ positive range - three weekends
     vacation days - specific exclude - e.g. public holiday
       √ within weekdays Wednesday, August 20th 2014
       √ within weekends Saturday, August 23rd 2014

```