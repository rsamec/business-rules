hobbies
==============

Business rules for hobbies.

+   employee
    +   name -> first name + last name is required
    +   email is required
+ hobbies
    +   each employee must give at least 2 hobbies, maximum hobbies is 4
    +   each hobby can have optional information about
        +   How often do you participate in this hobby
        +   Is a paid hobby
        +   Would recommend this hobby to a friend
    +   your firm has foreign employees - form must support czech, english and german languages

## Basic usage

```typescript
import moment = require('moment');
import _ = require('underscore');
import Validation = require('business-rules-engine');
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

Output of all business rules that are under tests.

```bash
 business rules for hobbies
     hobbies
       first name + last name
         √ fill no names 
         √ fill empty names 
         √ fill long names 
         √ fill some names 
       items
         √ fill no item 
         √ fill two items 
         √ fill five items 

```