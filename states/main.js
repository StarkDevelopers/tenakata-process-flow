const USSDService = require('../services/USSDService');
const USSDMenu = require('../services/USSDMenu');

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
  'MAX_RETRY_EXCEEDED',
  new USSDMenu()
    .menu('You have exceeded maximum retry attempts.')
    .setSelectText('Please try again later.')
    .build(),
  null,
  null,
  null,
  true
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
  'END',
  new USSDMenu()
    .menu('Thanks for using Tenakata Business App.')
    .build(),
  null,
  null,
  null,
  true
);