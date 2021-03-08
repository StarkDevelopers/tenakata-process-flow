const USSDService = require('../services/USSDService');
const USSDMenu = require('../services/USSDMenu');

const nextStates = {
    '1': 'SEND_REPORT_MESSAGE',
    '2': 'SEND_REPORT_MESSAGE',
    '3': 'SEND_REPORT_MESSAGE',
    '0': 'REPORTS'
}

const saveAsReportValue = {
    'reportTimeRange': {
        1: 'Today',
        2: 'Weekly',
        3: 'Monthly'
    }
}
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
        .build(),
    USSDService.__INPUT_TYPES__.EXACT,
    nextStates,
    saveAsReportValue
);


USSDService.state(
    'PEOPLE_WHO_OWE_ME_MONEY',
    null,
    USSDService.__INPUT_TYPES__.HANDLER,
    {
        handler: USSDService.services.PEOPLE_WHO_OWE_ME_MONEY
    }
);


USSDService.state(
    'PEOPLE_I_OWE_MONEY',
    null,
    USSDService.__INPUT_TYPES__.HANDLER,
    {
        handler: USSDService.services.PEOPLE_I_OWE_MONEY
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
        .build(),
    USSDService.__INPUT_TYPES__.EXACT,
    nextStates,
    saveAsReportValue
);


USSDService.state(
    'STOCK_PURCHASES',
    new USSDMenu()
        .menu('Please select Option:')
        .option('1. Stocks for Today')
        .option('2. Weekly Stocks')
        .option('3. Monthly Stocks')
        .option('0. Back')
        .build(),
    USSDService.__INPUT_TYPES__.EXACT,
    nextStates,
    saveAsReportValue
);

USSDService.state(
    'EXPENSES',
    new USSDMenu()
        .menu('Please select Option:')
        .option('1. Expenses for Today')
        .option('2. Weekly Expenses')
        .option('3. Monthly Expenses')
        .option('0. Back')
        .build(),
    USSDService.__INPUT_TYPES__.EXACT,
    nextStates,
    saveAsReportValue
);


USSDService.state(
    'SEND_REPORT_MESSAGE',
    null,
    USSDService.__INPUT_TYPES__.HANDLER,
    {
        handler: USSDService.services.SEND_REPORT_MESSAGE
    }
);



USSDService.state(
    'WILL_SEND_TEXT_MESSAGE',
    new USSDMenu()
        .setSelectText('An SMS with required details will be sent to your registered mobile number. Thank you. Reply with 1 to continue or 0 to Exit.')
        .option('1. Continue')
        .option('0. Exit')
        .build(),
    USSDService.__INPUT_TYPES__.EXACT,
    {
        '1': 'WELCOME',
        '0': 'END'
    }
);