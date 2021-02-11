const USSDService = require('./services/USSDService');
const USSDMenu = require('./services/USSDMenu');

module.exports = buildStates;

function buildStates() {
  USSDService.state(
    USSDService.__START__,
    new USSDMenu()
      .menu('Welcome to Tenakata Business App.')
      .setSelectText('Please Reply with your Password?')
      .build(),
    USSDService.__INPUT_TYPES__.REGEX,
    {
      regex: '^.+$',
      state: 'PRIVACY_POLICY'
    }
  );

  USSDService.state(
    'PRIVACY_POLICY',
    new USSDMenu()
      .menu('Please Accept the Terms and Conditions available at www.tenakata.com/Privacy.html.')
      .option('1. Yes')
      .option('1. No')
      .build(),
    USSDService.__INPUT_TYPES__.EXACT,
    {
      '1': 'PRIVACY_POLICY_YES',
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
    true
  );

  USSDService.state(
    'PRIVACY_POLICY_YES',
    new USSDMenu()
      .menu('Thank you for Successfully Signin to Tenakata Business App.')
      .setSelectText('Please Choose your Password or PIN to access the application:')
      .build(),
    USSDService.__INPUT_TYPES__.REGEX,
    {
      regex: '^.+$',
      state: 'WELCOME'
    }
  );

  USSDService.state(
    'WELCOME',
    new USSDMenu()
      .menu('Welcome to Tenakata Business Application.')
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
      '1': 'SALES_DETAILS_DATE',
      '2': 'SALES_DETAILS_DATE',
      '3': 'WELCOME'
    }
  );

  USSDService.state(
    'SALES_DETAILS_DATE',
    new USSDMenu()
      .menu('Enter Date[DDMMYYYY]')
      .build(),
    USSDService.__INPUT_TYPES__.DATE,
    {
      'DATE': 'SALES_DETAILS_AMOUNT'
    }
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
    }
  );

  USSDService.state(
    'SALES_DETAILS_DESCRIPTION',
    new USSDMenu()
      .menu('Enter Description')
      .build(),
    USSDService.__INPUT_TYPES__.REGEX,
    {
      regex: '^[\\w\\s]+$',
      state: 'SALES_DETAILS_DETAILS'
    }
  );

  USSDService.state(
    'SALES_DETAILS_DETAILS',
    new USSDMenu()
      .menu('Details')
      .build(),
    USSDService.__INPUT_TYPES__.REGEX,
    {
      regex: '^[\\w\\s]+$',
      state: 'SALES_DETAILS_SAVED'
    }
  );

  USSDService.state(
    'SALES_DETAILS_SAVED',
    new USSDMenu()
      .menu('Saved Sales Details')
      .build(),
    null,
    null,
    true
  );
}
