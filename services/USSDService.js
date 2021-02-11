const moment = require('moment');

const redis = require('../helpers/redis');

class USSDService {
  constructor() {
    this.__START__ = '__START__';
    this.states = {};
    this.INVALID_INPUT = 'Invalid input';
    this.__INPUT_TYPES__ = {
      EXACT: 'EXACT',
      REGEX: 'REGEX',
      DATE: 'DATE'
    };
  }

  async run(request) {
    const {
      text,
      previousState
    } = request.session;

    const {
      sessionId
    } = request.body;

    console.log(`Session: ${sessionId}\nPreviousState: ${previousState}\n`);

    try {
      const state = this.getNextState(previousState, text);

      // Save State to Redis-Session
      const session = Object.assign({}, request.session);
      session.previousState = state.name;
      await redis.setJSON(sessionId, session);

      if (state.end) {
        // If end state, return the response with END instruction.
        return this.endResponse(state.response);
      }

      // Return response...
      return this.continueResponse(state.response);
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
    switch(state.inputType) {
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
      return this.throwError('Invalid Date');
    }

    if (!moment(part, 'DDMMYYYY', true).isValid()) {
      return this.throwError('Invalid Date');
    }

    return state.next['DATE'];
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

  state(name, response, inputType, next, end) {
    if (this.states[name]) {
      throw new Error(`${name} state already exists!`);
    }

    this.states[name] = {
      name,
      response,
      inputType,
      next,
      end
    };
  }
}

module.exports = new USSDService();
