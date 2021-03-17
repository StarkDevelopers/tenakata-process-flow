const USSDService = require('../services/USSDService');
const USSDMenu = require('../services/USSDMenu');

USSDService.state(
    'REFER_A_FRIEND_MOBILE_NUMBER',
    new USSDMenu()
        .setSelectText('Please reply with your Friends Mobile Number: (Example 070012345678)')
        .build(),
    USSDService.__INPUT_TYPES__.REGEX,
    {
        regex: '^\\d{12}$',
        state: 'REFER_A_FRIEND_NAME'
    },
    'referAFriendMobileNumber'
);


USSDService.state(
    'REFER_A_FRIEND_NAME',
    new USSDMenu()
        .setSelectText('Please reply with your Friends Name (Example Sebie Salim)')
        .build(),
    USSDService.__INPUT_TYPES__.REGEX,
    {
        regex: '^[a-zA-Z]+\\s+[a-zA-Z]+$',
        state: 'SAVE_REFER_A_FRIEND_DETAILS'
    },
    'referAFriendName'
);


USSDService.state(
    'SAVE_REFER_A_FRIEND_DETAILS',
    null,
    USSDService.__INPUT_TYPES__.HANDLER,
    {
      handler: USSDService.services.SAVE_REFER_A_FRIEND_DETAILS
    }
  );

USSDService.state(
    'REFER_A_FRIEND_DETAILS_SAVED',
    new USSDMenu()
        .setSelectText('Thank you for Refering a Friend. An SMS will be sent to them and followup done by Tenakata Officers.')
        .setSelectText('Reply with 1 for Return to main menu.')
        .build(),
    USSDService.__INPUT_TYPES__.EXACT,
    {
        '1': 'WELCOME'
    }
);


USSDService.state(
    'REFER_A_FRIEND_DETAILS_FAILED',
    new USSDMenu()
      .menu('Failed to save Refer A Friend Details.')
      .build(),
    null,
    null,
    null,
    true
  );