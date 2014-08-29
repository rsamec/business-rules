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

var Hobbies = require('br-hobbies');

//create test data
    var data = {
        Person:{
            FirstName: 'John',
            LastName: 'Smith',
            Email: "joht.smith@gmail.com"
        },
        Hobbies:[
            {HobbyName:"English", Frequency:Hobbies.HobbyFrequency.Weekly , Paid:true,Recommendation:true},
            {HobbyName:"Swimming", Frequency:Hobbies.HobbyFrequency.Monthly , Paid:false,Recommendation:true}
        ]
    };

//business rules
var businessRules = new Hobbies.BusinessRules(data);

//execute validation
businessRules.Validate();

//verify and display results
if (businessRules.Errors.HasErrors) console.log(businessRules.Errors.ErrorMessage);
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