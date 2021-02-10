class USSDService {
  constructor() {
    this.__START__ = '__START__';
    this.states = {};
    this.INVALID_CODE = 'Invalid code';
  }

  run(request) {
    const {
      text,
      step,
      previousState
    } = request.session;

    if (previousState) {
      // TODO: Previous state already known. Continue from that.
    } else if (text) {
      const parts = text.split('*');

      const initialState = this.states[this.__START__];
      let state = initialState;
      for (const part of parts) {
        const nextState = state.next[part];

        // Option not found!
        if (!nextState) {
          return this.endResponse(this.INVALID_CODE);
        }

        state = this.states[nextState];

        // State not found!
        if (!state) {
          return this.endResponse(this.INVALID_CODE);
        }
      }
      return this.continueResponse(state.response);
    } else {
      return this.continueResponse(this.states[this.__START__].response);
    }
  }

  continueResponse(response) {
    return `CON ${response}`;
  }

  endResponse(response) {
    return `END ${response}`;
  }

  state(name, response, next) {
    if (this.states[name]) {
      throw new Error(`${name} state already exists!`);
    }

    this.states[name] = {
      response,
      next
    };
  }

  sessionManager() {

  }
}

module.exports = new USSDService();
