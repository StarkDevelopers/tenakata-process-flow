const USSDService = require('./services/USSDService');
const USSDMenu = require('./services/USSDMenu');

module.exports = buildStates;

function buildStates() {
  USSDService.state(
    USSDService.__START__,
    null,
    USSDService.__INPUT_TYPES__.HANDLER,
    {
      handler: USSDService.services.REGISTRATION_CHECK
    }
  );

  USSDService.state(
    'REGISTERED',
    new USSDMenu()
      .menu('[NAME], Welcome to Tenakata Business App.')
      .setSelectText('Please Reply with your Password?')
      .build(),
    USSDService.__INPUT_TYPES__.REGEX,
    {
      regex: '^.+$',
      state: 'AUTHENTICATION'
    }
  );

  USSDService.state(
    'AUTHENTICATION',
    null,
    USSDService.__INPUT_TYPES__.HANDLER,
    {
      handler: USSDService.services.AUTHENTICATION
    }
  );

  USSDService.state(
    'UNAUTHENTICATED',
    new USSDMenu()
      .menu('You have entered a wrong password.')
      .setSelectText('Please Enter your password again?')
      .build(),
    USSDService.__INPUT_TYPES__.REGEX,
    {
      regex: '^.+$',
      state: 'AUTHENTICATION'
    }
  );

  USSDService.state(
    'FIRST_TIME_USER_CHECK',
    null,
    USSDService.__INPUT_TYPES__.HANDLER,
    {
      handler: USSDService.services.FIRST_TIME_USER_CHECK
    }
  );

  USSDService.state(
    'NON_REGISTERED',
    new USSDMenu()
      .menu('You have not been registered to use the Tenakata Application.')
      .setSelectText('Please contact +254728888863 to get Registered.')
      .build(),
    null,
    null,
    null,
    true
  );

  USSDService.state(
    'PRIVACY_POLICY',
    new USSDMenu()
      .menu('Please Accept the Terms and Conditions available at www.tenakata.com/Privacy.html.')
      .option('1. Yes')
      .option('2. No')
      .build(),
    USSDService.__INPUT_TYPES__.EXACT,
    {
      '1': 'WELCOME',
      '2': 'PRIVACY_POLICY_NO'
    }
  );

  USSDService.state(
    'PRIVACY_POLICY_NO',
    new USSDMenu()
      .menu('Thank you. We are unable to complete your registration')
      .build(),
    null,
    null,
    null,
    true
  );

  USSDService.state(
    'WELCOME',
    new USSDMenu()
      .menu('Please select a Transaction.')
      .setSelectText('Please select:')
      .option('1. Sales')
      .option('2. Money Out')
      .option('3. Reports')
      .option('4. Training')
      .option('5. Loans')
      .option('6. Stock Purchase')
      .build(),
    USSDService.__INPUT_TYPES__.EXACT,
    {
      '1': 'SALES',
      '2': 'MONEY_OUT',
      '3': 'REPORTS',
      '4': 'TRAINING',
      '5': 'LOANS',
      '6': 'STOCK_PURCHASE'
    },
    {
      'menu': {
        1: 'sales',
        2: 'moneyOut',
        3: 'reports',
        4: 'training',
        5: 'loans',
        6: 'stockPurchase',
      }
    }
  );

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
      '1': 'CASH_DATE_SELECTION',
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
    'CASH_DATE_SELECTION',
    new USSDMenu()
      .menu('Selece')
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
      'INVALID_DATE': 'CASH_DATE_SELECTION'
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


  USSDService.state(
    'END',
    new USSDMenu()
      .menu('Thanks for using Tenakata Business App.')
      .build(),
    null,
    null,
    null,
    true
  );
}
