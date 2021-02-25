const USSDService = require('../services/USSDService');
const USSDMenu = require('../services/USSDMenu');

USSDService.state(
  'SALES',
  new USSDMenu()
    .menu('Select')
    .option('1. Cash')
    .option('2. Credit Sale')
    .option('3. Back')
    .build(),
  USSDService.__INPUT_TYPES__.EXACT,
  {
    '1': 'SALES_DATE_SELECTION',
    '2': 'SALES_DETAILS_DATE',
    '3': 'WELCOME'
  },
  {
    'subMenu': {
      1: 'cash',
      2: 'creditSale',
      3: 'back'
    }
  }
);

USSDService.state(
  'SALES_DATE_SELECTION',
  new USSDMenu()
    .menu('Select')
    .option('1.Today')
    .option('2.Other Dates')
    .build(),
  USSDService.__INPUT_TYPES__.EXACT,
  {
    '1': 'SALES_DETAILS_AMOUNT',
    '2': 'SALES_DETAILS_DATE'
  },
  'cashDateSelection'
);

USSDService.state(
  'SALES_DETAILS_DATE',
  new USSDMenu()
    .menu('Enter Date[DDMMYYYY]')
    .build(),
  USSDService.__INPUT_TYPES__.DATE,
  {
    'VALID_DATE': 'SALES_DETAILS_AMOUNT',
    'INVALID_DATE': 'SALES_DATE_SELECTION'
  },
  'date'
);

USSDService.state(
  'SALES_DETAILS_AMOUNT',
  new USSDMenu()
    .menu('Enter The Amount in KES')
    .build(),
  USSDService.__INPUT_TYPES__.REGEX,
  {
    regex: '^\\d+$',
    state: 'SALES_DETAILS_DESCRIPTION'
  },
  'amount'
);

USSDService.state(
  'SALES_DETAILS_DESCRIPTION',
  new USSDMenu()
    .menu('Enter Description')
    .build(),
  USSDService.__INPUT_TYPES__.REGEX,
  {
    regex: '^[\\w\\s\\W]+$',
    state: 'SALES_DETAILS_DETAILS'
  },
  'description'
);

USSDService.state(
  'SALES_DETAILS_DETAILS',
  new USSDMenu()
    .menu('Details')
    .build(),
  USSDService.__INPUT_TYPES__.REGEX,
  {
    regex: '^[\\w\\s\\W]+$',
    state: 'SAVE_SALES_DETAILS'
  },
  'details'
);

USSDService.state(
  'SAVE_SALES_DETAILS',
  null,
  USSDService.__INPUT_TYPES__.HANDLER,
  {
    handler: USSDService.services.SAVE_CASH_CREDIT_SALES_DETAILS
  }
);

USSDService.state(
  'SALES_DETAILS_SAVED',
  new USSDMenu()
    .menu('Sales Details Saved.')
    .option('1.Continue')
    .option('2.Exit')
    .build(),
  USSDService.__INPUT_TYPES__.EXACT,
  {
    '1': 'WELCOME',
    '2': 'END'
  }
);

USSDService.state(
  'SALES_DETAILS_FAILED',
  new USSDMenu()
    .menu('Failed to save Sales Details.')
    .build(),
  null,
  null,
  null,
  true
);