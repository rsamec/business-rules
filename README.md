business-rules
==============

Business rules repository

This is repository of business rules.
Business rules are defined with help of UI agnostic form validation engine [node-form](https://github.com/rsamec/form).

+ API [https://github.com/rsamec/business-rules]
+ Usage nodejs [https://github.com/rsamec/node-form-app]
+ Usage angularjs [[https://github.com/rsamec/angular-form-app]

## Install

To install and run example

```bash
git clone https://github.com/rsamec/business-rules
npm install
tsd update
```

To build business rules - select business rules you want
```bash
grunt dist-vacationApproval
grunt dist-invoice
...
```


To run tests
```bash
grunt test-vacationApproval
grunt test-invoice
...
```

All source code is written in typescript.
To compile typescript

```bash
tsc models/vacationApproval/BusinessRules.ts --t ES5 --out business-rules.js
tsc models/invoice/BusinessRules.ts --t ES5 --out business-rules.js
```

## Define your own business rules
+ find out descriptive name of your business rules
+ use this name and create directory in src/models
+ create Data.ts to define data structure for vacation approval
+ crate BusinessRules.ts to define business rules
+ add tests in directory in test/models
