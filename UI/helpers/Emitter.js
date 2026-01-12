class _Emitter {
  constructor() {
    this.eventMap = {};
    this.states = {};
  }

  subscribe(event, callback, options = { replay: true }) {
    if (this.eventMap[event] === undefined) {
      this.eventMap[event] = new Set();
    }

    this.eventMap[event].add(callback);

    // Immediately replay last known state
    if (options.replay && event in this.states) {
      callback(this.states[event]);
    }

    return {
      unsubscribe: () => {
        this.eventMap[event].delete(callback);
      },
    };
  }

  setState(event, value) {
    this.states[event] = value;
    this.publish(event, value);
  }

  setStateList(event, value) {
    this.states[event] = value;
    this.publishList(event, value);
  }

  publish(event, args = []) {
    const res = [];
    (this.eventMap[event] ?? []).forEach((callback) => {
      res.push(callback(...args));
    });
    return res;
  }

  publishList(event, args = []) {
    const res = [];
    (this.eventMap[event] ?? []).forEach((callback) => {
      res.push(callback(args));
    });
    return res;
  }
}

const Emitter = new _Emitter();
export default Emitter;
