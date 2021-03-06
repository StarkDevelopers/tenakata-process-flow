const moment = require('moment');
const redis = require('../helpers/redis');
const fetch = require('../helpers/request');
const URLS = require('../helpers/urls');

class USSDService {
  constructor() {
    this.__START__ = '__START__';
    this.states = {};
    this.INVALID_INPUT = 'Invalid input';
    this.UNEXPECTED_ERROR = 'Unexpected error occurred';
    this.__INPUT_TYPES__ = {
      EXACT: 'EXACT',
      REGEX: 'REGEX',
      DATE: 'DATE',
      HANDLER: 'HANDLER'
    };
    this.services = {
      REGISTRATION_CHECK: 'registrationCheck',
      AUTHENTICATION: 'authentication',
      FIRST_TIME_USER_CHECK: 'firstTimeUserCheck',
      SEND_TERMS_AND_CONDITIONS_MESSAGE:'sendTermsAndConditionsMsg',
      SAVE_CASH_CREDIT_SALES_DETAILS: 'saveCashCreditSalesDetails',
      SAVE_CASH_MONEY_OUT_DETAILS: 'saveCashMoneyOutDetails',
      SEND_REPORT_MESSAGE: 'sendReportMessage',
      PEOPLE_WHO_OWE_ME_MONEY: 'sendPeopleWhoOweMeMoneyReport',
      PEOPLE_I_OWE_MONEY: 'sendPeopleIOweMeMoneyReport',
      SAVE_REFER_A_FRIEND_DETAILS:'saveReferAFriendDetails'
    };
  }

  async run(request) {
    const {
      text,
      previousState,
      ownerName
    } = request.session;

    const {
      sessionId
    } = request.body;

    console.log(`Session: ${sessionId}\nPreviousState: ${previousState}\n`);

    try {
      const session = Object.assign({}, request.session);
      let state = this.getNextState(previousState, text);

      // Save user input to Redis-Session
      if (previousState && this.states[previousState].saveAs) {
        const saveAs = this.states[previousState].saveAs;
        if (typeof saveAs === 'string') {
          session[saveAs] = text.split('*').pop();
        } else if (typeof saveAs === 'object') {
          const saveAsName = Object.keys(saveAs)[0];
          session[saveAsName] = saveAs[saveAsName][text.split('*').pop()];
        }
      }

      // Handle the function if this state has a handler
      while (state && state.inputType === this.__INPUT_TYPES__.HANDLER) {
        state = await this[state.next.handler](request, session);
      }

      // Save State to Redis-Session
      session.previousState = state.name;
      await redis.setJSON(sessionId, session);

      if (state.end) {
        // If end state, return the response with END instruction.
        return this.endResponse(state.response);
      }

      let response = state.response;
      if (response.includes('[NAME]') && (ownerName || session.ownerName)) {
        response = response.replace('[NAME]', ownerName || session.ownerName);
      }

      // Return response...
      return this.continueResponse(response);
    } catch (error) {
      if (error.type === 'END') {
        console.log(`Session: ${sessionId}\nEND: ${error.endResponse}\n`);
        return error.endResponse;
      }
      console.log(`Session: ${sessionId}\nError: ${error.stack}\n`);

      return this.endResponse(this.INVALID_INPUT);
    }
  }

  getNextState(previousState, text) {
    let state = null;
    if (previousState && text) {
      // Previous state already known. Continue from that.
      const part = text.split('*').pop();
      const initialState = this.states[previousState];

      state = this.traceNextState([part], initialState);
    } else if (text) {
      // If Previous state not found in Session which SHOULD NOT be the case.
      const parts = text.split('*');
      const initialState = this.states[this.__START__];

      state = this.traceNextState(parts, initialState);
    } else {
      // First incoming request.
      state = this.states[this.__START__];
    }

    // If state not found, throw an error.
    if (!state) {
      this.throwError();
    }

    return state;
  }

  traceNextState(parts, previousState) {
    let state = previousState;

    // Loop Through parts
    for (const part of parts) {
      // Parse input and get the nextStateName.
      const nextStateName = this.parseInput(state, part);

      // Input entered by user not found in NextState Options.
      if (!nextStateName) {
        return this.throwError();
      }

      // Get the Next State.
      state = this.states[nextStateName];

      // Next State not found!
      if (!state) {
        return this.throwError();
      }
    }

    return state;
  }

  parseInput(state, part) {
    switch (state.inputType) {
      case this.__INPUT_TYPES__.EXACT:
        return state.next[part];
      case this.__INPUT_TYPES__.REGEX:
        return this.parseRegex(state, part);
      case this.__INPUT_TYPES__.DATE:
        return this.parseDate(state, part);
      default:
        return state.next[part];
    }
  }

  parseRegex(state, part) {
    const regex = state.next.regex;

    if ((new RegExp(regex)).exec(part)) {
      return state.next.state;
    }

    return this.throwError();
  }

  parseDate(state, part) {
    const regex = '^\\d{8}$';

    if (!(new RegExp(regex, 'g')).exec(part)) {
      return state.next['INVALID_DATE'];
    }

    if (!moment(part, 'DDMMYYYY', true).isValid()) {
      return state.next['INVALID_DATE'];
    }

    return state.next['VALID_DATE'];
  }

  throwError(response = this.INVALID_INPUT) {
    throw {
      type: 'END',
      endResponse: this.endResponse(response)
    };
  }

  continueResponse(response) {
    return `CON ${response}`;
  }

  endResponse(response) {
    return `END ${response}`;
  }

  state(name, response, inputType, next, saveAs, end) {
    if (this.states[name]) {
      throw new Error(`${name} state already exists!`);
    }

    this.states[name] = {
      name,
      response,
      inputType,
      next,
      saveAs,
      end
    };
  }

  /**
   * Check phone number against the server using API
   * If Registered then save required details to REDIS and return REGISTERED State
   * If not Registered then return to NON_REGISTERED State
   */
  async registrationCheck(request, session) {
    let { phoneNumber } = request.body;
    const countryCode = phoneNumber.substring(1, 4);
    phoneNumber = phoneNumber.substring(4);
    const data = '{}';

    const headers = {
      'x-api-key': 'admin@123'
    };

    try {
      const authenticationUrl = URLS.AUTHENTICATION.replace('[PHONE_NUMBER]', phoneNumber).replace('[COUNTRY_CODE]', countryCode);
      let jsonResponse = await fetch(authenticationUrl, 'post', data, headers);

      if (jsonResponse.status == 200) {
        session.id = jsonResponse.result.id;
        session.ownerName = jsonResponse.result.owner_name;
        session.businessName = jsonResponse.result.business_name;
        session.password = jsonResponse.result.password;
        session.status = jsonResponse.result.status;
        session.token = jsonResponse.result.token;
        return this.states['REGISTERED'];
      }

      return this.states['NON_REGISTERED'];
    } catch (error) {
      console.error(`Error: Check registered phone number: ${error.stack}`);
      this.throwError(this.UNEXPECTED_ERROR);
    }
  }

  async authentication(_, session) {
    const password = session.text.split('*').pop();

    if (session.password === password) {
      return this.states['FIRST_TIME_USER_CHECK'];
    }

    if (session.retryCount === 3) {
      return this.states['MAX_RETRY_EXCEEDED'];
    } else {
      if (!session.retryCount) {
        session.retryCount = 0;
      }
      session.retryCount += 1;
    }

    return this.states['UNAUTHENTICATED'];
  }

  async firstTimeUserCheck(_, session) {
    if (session.status === '0') {
      return this.states['PRIVACY_POLICY'];
    }
    return this.states['WELCOME'];
  }

  async saveCashCreditSalesDetails(_, session) {
    try {
      const {
        id,
        subMenu,
        cashDateSelection,
        date,
        amount,
        description,
        details,
        token,
        phoneNumber
      } = session;

      const data = '{}';
      let cashDate;
      cashDate = cashDateSelection == 1 ? moment().format('YYYY-MM-DD') : moment(date, 'DDMMYYYY', true).format('YYYY-MM-DD');

      let salesUrl;
      if (subMenu === 'cash') {
        salesUrl = URLS.SALES.replace('[USER_ID]', id)
          .replace('[SALES_OR_PURCHASE]', 'sales')
          .replace('[DATE]', cashDate)
          .replace('[AMOUNT]', amount)
          .replace('[DETAILS]', details)
          .replace('[PAYMENT_TYPE]', 'cash')
          .replace('[DESCRIPTION]', description);
      } else {
        const countryCode = phoneNumber.substring(1, 4);
        const userPhoneNumber = phoneNumber.substring(4);

        salesUrl = URLS.CREDIT_SALES.replace('[USER_ID]', id)
          .replace('[SALES_OR_PURCHASE]', 'sales')
          .replace('[DATE]', cashDate)
          .replace('[AMOUNT]', amount)
          .replace('[DETAILS]', details)
          .replace('[PAYMENT_TYPE]', 'credit')
          .replace('[DESCRIPTION]', description)
          .replace('[PHONE_NUMBER]', userPhoneNumber)
          .replace('[COUNTRY_CODE]', countryCode);
      }

      const headers = {
        'x-api-key': 'admin@123',
        token
      };

      const jsonResponse = await fetch(salesUrl, 'post', data, headers);
      console.log(`Response: Save Cash Credit Sales Details: ${JSON.stringify(jsonResponse)}`);

      if (jsonResponse.status == 200) {
        return this.states['SALES_DETAILS_SAVED'];
      }

      return this.states['SALES_DETAILS_FAILED'];
    } catch (error) {
      console.error(`Error: Save Cash Credit Sales Details: ${error.stack}`);
      this.throwError(this.UNEXPECTED_ERROR);
    }

  }

  async saveCashMoneyOutDetails(_, session) {
    try {
      const {
        id,
        subMenu,
        cashDateSelection,
        date,
        amount,
        description,
        descriptionType,
        details,
        token,
        phoneNumber
      } = session;

      const data = '{}';
      let cashDate;
      cashDate = cashDateSelection == 1 ? moment().format('YYYY-MM-DD') : moment(date, 'DDMMYYYY', true).format('YYYY-MM-DD');
      let salesUrl;
      
      if (subMenu === 'cash') {
        salesUrl = URLS.MONEY_OUT.replace('[USER_ID]', id)
          .replace('[SALES_OR_PURCHASE]', 'purchase')
          .replace('[DATE]', cashDate)
          .replace('[AMOUNT]', amount)
          .replace('[DETAILS]', details)
          .replace('[PAYMENT_TYPE]', 'cash')
          .replace('[DESCRIPTION]', description)
          .replace('[DESCRIPTION_TYPE]', descriptionType);
      } else {
        const countryCode = phoneNumber.substring(1, 4);
        const userPhoneNumber = phoneNumber.substring(4);

        salesUrl = URLS.CREDIT_MONEY_OUT.replace('[USER_ID]', id)
          .replace('[SALES_OR_PURCHASE]', 'purchase')
          .replace('[DATE]', cashDate)
          .replace('[AMOUNT]', amount)
          .replace('[DETAILS]', details)
          .replace('[PAYMENT_TYPE]', 'credit')
          .replace('[DESCRIPTION]', description)
          .replace('[DESCRIPTION_TYPE]', descriptionType)
          .replace('[PHONE_NUMBER]', userPhoneNumber)
          .replace('[COUNTRY_CODE]', countryCode);
      }

      const headers = {
        'x-api-key': 'admin@123',
        token
      };

      const jsonResponse = await fetch(salesUrl, 'post', data, headers);
      console.log(`Response: Save Cash Money Out Details: ${JSON.stringify(jsonResponse)}`);

      if (jsonResponse.status == 200) {
        return this.states['MONEY_OUT_DETAILS_SAVED'];
      }

      return this.states['MONEY_OUT_DETAILS_FAILED'];
    } catch (error) {
      console.error(`Error: Save Cash Money Out Details: ${error.stack}`);
      this.throwError(this.UNEXPECTED_ERROR);
    }

  }

  //################ Report related functions #################//

  async sendReportMessage(_, session) {
    try {
      if (!URLS.REPORTS[askingReport]) {
        return this.states['WILL_SEND_TEXT_MESSAGE']
      }

      //Based on previous state use API URL
      const askingReport = session.previousState;
      console.log(session.previousState);
      // Parameter of which time range user wants reports. Today, Weekly or Monthly.
      const reportFrequency = session.reportTimeRange.toLowerCase();
      console.log(session.reportTimeRange)

      let {
        id,
        token
      } = session;
      
      const data = '{}';
      const  reportURL = URLS.REPORTS[askingReport]
        .replace('[BUSINESS_ID]', id)
        .replace('[FREQUENCY]', reportFrequency)
       
      const headers = {
        'x-api-key': 'admin@123',
        token
      };

      const jsonResponse = await fetch(reportURL, 'post', data, headers);
      console.log(`Response: Sending Reports Message: ${JSON.stringify(jsonResponse)}`);

      if (jsonResponse.status == 200) {
        return this.states['WILL_SEND_TEXT_MESSAGE']
      }
      return this.states['SEND_MESSAGE_FAILED'];
    } catch (error) {
      console.error(`Error: Sending Reports Message: ${error.stack}`);
      this.throwError(this.UNEXPECTED_ERROR);
    }
  }

  async sendPeopleWhoOweMeMoneyReport(_, session) {
    try {

      return this.states['WILL_SEND_TEXT_MESSAGE']
    } catch (error) {
      console.error(`Error: Sending Message of People Who Owe Me Money Report: ${error.stack}`);
      this.throwError(this.UNEXPECTED_ERROR);
    }
  }

  async sendPeopleIOweMeMoneyReport(_, session) {
    try {

      return this.states['WILL_SEND_TEXT_MESSAGE']
    } catch (error) {
      console.error(`Error: Sending Message of People I Owe Money Report: ${error.stack}`);
      this.throwError(this.UNEXPECTED_ERROR);
    }
  }

  //************ Save Refer A Friend Details ********************/

  async saveReferAFriendDetails(_, session) {
    try {
      let {
        id,
        phoneNumber,
        referAFriendName,
        referAFriendMobileNumber,
        token
      } = session;

      phoneNumber = phoneNumber.substring(4);
      
      const data = '{}';
      const referAFriendUrl = URLS.REFER_A_FRIEND.replace('[USER_ID]', id)
        .replace('[USER_PHONE_NUMBER]', phoneNumber)
        .replace('[REFEREE_PHONE_NUMBER]', referAFriendMobileNumber)
        .replace('[REFERE_NAME]', referAFriendName)

      const headers = {
        'x-api-key': 'admin@123',
        token
      };

      const jsonResponse = await fetch(referAFriendUrl, 'post', data, headers);
      console.log(`Response: Save Refer A Friend Details Details: ${JSON.stringify(jsonResponse)}`);

      if (jsonResponse.status == 200) {
        return this.states['REFER_A_FRIEND_DETAILS_SAVED'];
      }

      return this.states['REFER_A_FRIEND_DETAILS_FAILED'];
    } catch (error) {
      console.error(`Error: Save Refer A Friend Details: ${error.stack}`);
      this.throwError(this.UNEXPECTED_ERROR);
    }

  }

  /******* Send Terms and Conditions Message *************/

  async sendTermsAndConditionsMsg(_, session) {
    try {
      let {
        id,
        phoneNumber,
        token
      } = session;

      phoneNumber=phoneNumber.substring(4);
      
      const data = '{}';
      const termsAndConditionsUrl = URLS.TERMS_AND_CONDITIONS
        .replace('[USER_ID]', id)
        .replace('[USER_PHONE_NUMBER]', phoneNumber)
        
      const headers = {
        'x-api-key': 'admin@123',
        token
      };

      const jsonResponse = await fetch(termsAndConditionsUrl, 'post', data, headers);
      console.log(`Response: Send Terms and Conditions Message: ${JSON.stringify(jsonResponse)}`);

      if (jsonResponse.status == 200) {
        return this.states['SEND_TERMS_AND_CONDITIONS_MESSAGE_SUCCESS'];
      }

      return this.states['SEND_TERMS_AND_CONDITIONS_MESSAGE_FAILED'];
    } catch (error) {
      console.error(`Error: Sending message of Terms & Conditions : ${error.stack}`);
      this.throwError(this.UNEXPECTED_ERROR);
    }
  }

}

module.exports = new USSDService();
