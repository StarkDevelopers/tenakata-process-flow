const USSDService = require('./services/USSDService');
const USSDMenu = require('./services/USSDMenu');

module.exports = buildStates;

function buildStates() {
  USSDService.state(
    USSDService.__START__,
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
    {
      '1': 'CASH',
      '2': 'CREDIT_SALE',
      '3': USSDService.__START__
    }
  );

  USSDService.state(
    'MONEY_OUT',
    new USSDMenu()
      .menu('Select')
      .option('1. Cash')
      .option('2. Credit')
      .option('3. Back')
      .build(),
    {
      '1': 'CASH',
      '2': 'CREDIT',
      '3': USSDService.__START__
    }
  );
}
