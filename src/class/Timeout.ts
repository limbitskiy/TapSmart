class Timeout {
  interval: number | null;
  callback: (() => void) | null;
  _timeoutFn: ReturnType<typeof setTimeout> | null;
  status: "stopped" | "running";

  constructor() {
    this.interval = null;
    this.callback = null;
    this._timeoutFn = null;
    this.status = "stopped";
  }

  start(interval: number, callback: () => void) {
    // console.log(`Starting timeout`);
    this.interval = interval;
    this.callback = callback;
    this.status = "running";
    this._timeoutFn = setTimeout(() => {
      if (this.callback) {
        this.callback();
      }
    }, this.interval);
  }

  stop() {
    // console.log(`Stopping timeout`);
    if (this._timeoutFn) {
      this.status = "stopped";
      clearTimeout(this._timeoutFn);
      this._timeoutFn = null;
    }
  }

  resume() {
    if (this.interval) {
      this.status = "running";
      this._timeoutFn = setTimeout(() => {
        if (this.callback) {
          this.callback();
        }
      }, this.interval);
    }
  }
}

export default Timeout;
