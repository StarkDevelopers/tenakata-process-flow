const USSDService = require('../services/USSDService');
const USSDMenu = require('../services/USSDMenu');

USSDService.state(
    'REPORTS',
    new USSDMenu()
        .menu('Please select option:')
        .option('1. My Profit')
        .option('2. People who owe me money')
        .option('3. People I owe money')
        .option('4. Sales')
        .option('5. Stock Purchases')
        .option('6. Expenses')
        .option('0. Back')
        .build(),
    USSDService.__INPUT_TYPES__.EXACT,
    {
        '1': 'MY_PROFIT',
        '2': 'PEOPLE_WHO_OWE_ME_MONEY',
        '3': 'PEOPLE_I_OWE_MONEY',
        '4': 'SALES_REPORT',
        '5': 'STOCK_PURCHASES',
        '6': 'EXPENSES',
        '0': 'WELCOME'
    }
);


USSDService.state(
    'MY_PROFIT',
    new USSDMenu()
        .menu('Please select Option:')
        .option('1. Profit for Today')
        .option('2. Weekly Profit')
        .option('3. Monthly Profit')
        .option('0. Back')
        .setEndText('An SMS with profit will be sent to your phone. Thank you. Reply with 1 to continue or 0 to Exit.')
        .build(),
    USSDService.__INPUT_TYPES__.EXACT,
    {
        // '1': 'SALES_DETAILS_AMOUNT',
        '0': 'REPORTS'
    }
);



//TODO: API CALL HERE
USSDService.state(
    'PEOPLE_WHO_OWE_ME_MONEY',
    new USSDMenu()
        .menu('Please select Option:')
        .option('0. Back')
        .setEndText('An SMS with profit will be sent to your phone. Thank you. Reply with 1 to continue or 0 to Exit.')
        .build(),
    USSDService.__INPUT_TYPES__.EXACT,
    {
        // '1': 'SALES_DETAILS_AMOUNT',
        '0': 'REPORTS'
    }
);


//TODO: API CALL HERE
USSDService.state(
    'PEOPLE_I_OWE_MONEY',
    new USSDMenu()
        .menu('Please select Option:')
        .option('1. ')
        .option('0. Back')
        .setEndText('Thank you. Reply with 1 to continue or 0 to Exit.')
        .build(),
    USSDService.__INPUT_TYPES__.EXACT,
    {
        // '1': 'SALES_DETAILS_AMOUNT',
        '0': 'REPORTS'
    }
);

USSDService.state(
    'SALES_REPORT',
    new USSDMenu()
        .menu('Please select Option:')
        .option('1. Sales for Today')
        .option('2. Weekly Sales')
        .option('3. Monthly Sales')
        .option('0. Back')
        .setEndText('An SMS with sales details will be sent to your phone.Thank you. Reply with 1 to continue or 0 to Exit.')
        .build(),
    USSDService.__INPUT_TYPES__.EXACT,
    {
        // '1': 'SALES_DETAILS_AMOUNT',
        '0': 'REPORTS'
    }
);


USSDService.state(
    'STOCK_PURCHASES',
    new USSDMenu()
        .menu('Please select Option:')
        .option('1. Stocks for Today')
        .option('2. Weekly Stocks')
        .option('3. Monthly Stocks')
        .option('0. Back')
        .setEndText('An SMS with stocks details will be sent to your phone.Thank you. Reply with 1 to continue or 0 to Exit.')
        .build(),
    USSDService.__INPUT_TYPES__.EXACT,
    {
        // '1': 'SALES_DETAILS_AMOUNT',
        '0': 'REPORTS'
    }
);

USSDService.state(
    'EXPENSES',
    new USSDMenu()
        .menu('Please select Option:')
        .option('1. Expenses for Today')
        .option('2. Weekly Expenses')
        .option('3. Monthly Expenses')
        .option('0. Back')
        .setEndText('An SMS with expenses details will be sent to your phone.Thank you. Reply with 1 to continue or 0 to Exit.')
        .build(),
    USSDService.__INPUT_TYPES__.EXACT,
    {
        // '1': 'SALES_DETAILS_AMOUNT',
        '0': 'REPORTS'
    }
);