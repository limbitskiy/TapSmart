export class Interval {
  interval: number;
  callback: () => void;
  _intervalFn: ReturnType<typeof setInterval> | null;

  constructor(interval: number, callback: () => void) {
    this.interval = interval;
    this.callback = callback;
    this._intervalFn = null;
  }

  start() {
    // console.log(`Starting breakpoint`);
    this._intervalFn = setInterval(() => {
      this.callback();
    }, this.interval);
  }

  stop() {
    // console.log(`Stopping breakpoint`);
    if (this._intervalFn) {
      clearInterval(this._intervalFn);
      this._intervalFn = null;
    }
  }
}

export class Timer {
  interval: number;
  callback: () => void;
  _timeoutFn: ReturnType<typeof setTimeout> | null;

  constructor(interval: number, callback: () => void) {
    this.interval = interval;
    this.callback = callback;
    this._timeoutFn = null;
  }

  start() {
    // console.log(`Starting timeout`);
    this._timeoutFn = setTimeout(() => {
      this.callback();
    }, this.interval);
  }

  stop() {
    // console.log(`Stopping timeout`);
    if (this._timeoutFn) {
      clearTimeout(this._timeoutFn);
      this._timeoutFn = null;
    }
  }
}
