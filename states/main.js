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
    .menu('[NAME], Welcome to Tenakata.')
    .setSelectText('Please Reply with your Password?')
    .setSelectText('')
    .setSelectText('Forgot Password? Call +254728888863.')
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
    .menu('Please select option.')
    .option('1. Sales')
    .option('2. Money Out')
    .option('3. Reports')
    .option('4. Refer a Friend')
    .option('5. Terms and Conditions')
    .option('0. Exit')
    .build(),
  USSDService.__INPUT_TYPES__.EXACT,
  {
    '1': 'SALES',
    '2': 'MONEY_OUT',
    '3': 'REPORTS',
    '4': 'REFER_A_FRIEND',
    '5': 'TERMS_AND_CONDITIONS',
    '0': 'END'
  },
  {
    'menu': {
      1: 'sales',
      2: 'moneyOut',
      3: 'reports',
      4: 'referAFriend',
      5: 'termsAndConditions',
    }
  }
);

USSDService.state(
  'REFER_A_FRIEND',
  new USSDMenu()
    .setSelectText('Please reply with your Friends Mobile Number: (Example 070012345678)')
    .setSelectText('Please reply with your Friends Name (Example Sebie Salim)')
    .setEndText('Thank you for Refering a Friend. An SMS will be sent to them and followup done by Tenakata Officers.')
    .setEndText('Press 1 to return to main menu.')
    .build(),
  USSDService.__INPUT_TYPES__.EXACT,
  {
    '1': 'WELCOME'
    // '2': 'PRIVACY_POLICY_NO'
  }
);


USSDService.state(
  'TERMS_AND_CONDITIONS',
  new USSDMenu()
    .menu('An SMS Message will be sent to your Phone with the Terms and Conditions')
    .setSelectText('Press 1 to return to main menu.')
    .build(),
  USSDService.__INPUT_TYPES__.EXACT,
  {
    '1': 'WELCOME'
  //   // '2': 'PRIVACY_POLICY_NO'
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