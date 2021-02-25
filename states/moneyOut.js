const USSDService = require('../services/USSDService');
const USSDMenu = require('../services/USSDMenu');

USSDService.state(
  'MONEY_OUT',
  new USSDMenu()
    .menu('Select')
    .option('1. Cash')
    // .option('2. Credit')
    .option('0. Back')
    .build(),
  USSDService.__INPUT_TYPES__.EXACT,
  {
    '1': 'MONEY_OUT_DATE_SELECTION',
    // '2': '',
    '0': 'WELCOME'
  },
  {
    'subMenu': {
      1: 'cash',
      // 2: 'creditSale',
      0: 'back'
    }
  }
);

USSDService.state(
  'MONEY_OUT_DATE_SELECTION',
  new USSDMenu()
    .menu('Select Transaction Date')
    .option('1. Today')
    .option('2. Other Dates')
    .build(),
  USSDService.__INPUT_TYPES__.EXACT,
  {
    '1': 'MONEY_OUT_DETAILS_AMOUNT',
    '2': 'MONEY_OUT_DETAILS_DATE'
  },
  'cashDateSelection'
);

USSDService.state(
  'MONEY_OUT_DETAILS_DATE',
  new USSDMenu()
    .menu('Enter Date in the format DDMMYYYY (e.g. 25022021)')
    .build(),
  USSDService.__INPUT_TYPES__.DATE,
  {
    'VALID_DATE': 'MONEY_OUT_DETAILS_AMOUNT',
    'INVALID_DATE': 'MONEY_OUT_DATE_SELECTION'
  },
  'date'
);

USSDService.state(
  'MONEY_OUT_DETAILS_AMOUNT',
  new USSDMenu()
    .menu('Enter Amount in KES')
    .build(),
  USSDService.__INPUT_TYPES__.REGEX,
  {
    regex: '^\\d+$',
    state: 'MONEY_OUT_DETAILS_DESCRIPTION'
  },
  'amount'
);

USSDService.state(
  'MONEY_OUT_DETAILS_DESCRIPTION',
  new USSDMenu()
    .menu('Enter Description (Example: Purchase for 25022021)')
    .build(),
  USSDService.__INPUT_TYPES__.REGEX,
  {
    regex: '^[\\w\\s\\W]+$',
    state: 'MONEY_OUT_DETAILS_DESCRIPTION_TYPE'
  },
  'description'
);

USSDService.state(
  'MONEY_OUT_DETAILS_DESCRIPTION_TYPE',
  new USSDMenu()
    .menu('Select the Transaction Type')
    .option('1. Stock')
    .option('2. Rent')
    .option('3. Salary')
    .option('4. Water')
    .option('5. Electricity')
    .option('6. Loan Repayment')
    .option('7. Equipment')
    .option('8. Others')
    .build(),
  USSDService.__INPUT_TYPES__.REGEX,
  {
    regex: '^[1-8]$',
    state: 'MONEY_OUT_DETAILS_DETAILS'
  },
  {
    'descriptionType': {
      1: 'Stock',
      2: 'Rent',
      3: 'Salary',
      4: 'Water',
      5: 'Electricity',
      6: 'Loan Repayment',
      7: 'Equipment',
      8: 'Others'
    }
  }
);

USSDService.state(
  'MONEY_OUT_DETAILS_DETAILS',
  new USSDMenu()
    .menu('Details (Example: Jeans 500)')
    .build(),
  USSDService.__INPUT_TYPES__.REGEX,
  {
    regex: '^[\\w\\s\\W]+$',
    state: 'SAVE_MONEY_OUT_DETAILS'
  },
  'details'
);

USSDService.state(
  'SAVE_MONEY_OUT_DETAILS',
  null,
  USSDService.__INPUT_TYPES__.HANDLER,
  {
    handler: USSDService.services.SAVE_CASH_MONEY_OUT_DETAILS
  }
);

USSDService.state(
  'MONEY_OUT_DETAILS_SAVED',
  new USSDMenu()
    .menu('Purchase Details Saved.')
    .option('1. Continue')
    .option('0. Exit')
    .build(),
  USSDService.__INPUT_TYPES__.EXACT,
  {
    '1': 'WELCOME',
    '0': 'END'
  }
);

USSDService.state(
  'MONEY_OUT_DETAILS_FAILED',
  new USSDMenu()
    .menu('Failed to save Money Out Details.')
    .build(),
  null,
  null,
  null,
  true
);