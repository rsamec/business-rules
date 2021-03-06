business-rules
==============

This is repository of business rules.
Business rules are defined with help of UI agnostic  [business-rules-engine](https://github.com/rsamec/business-rules-engine).

+ [API] (http://rsamec.github.io/business-rules/docs/globals.html)
+ [nodejs example] (https://github.com/rsamec/node-form-app)
+ [angularjs example] (https://github.com/rsamec/angular-form-app)

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
