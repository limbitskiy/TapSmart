export class BreakpointInterval {
  interval: number;
  callback: () => void;
  _intervalFn: ReturnType<typeof setInterval> | null;

  constructor(interval: number, callback: () => void) {
    this.interval = interval;
    this.callback = callback;
    this._intervalFn = null;
  }

  start() {
    console.log(`Starting breakpoint`);
    this._intervalFn = setInterval(() => {
      this.callback();
    }, this.interval);
  }

  stop() {
    console.log(`Stopping breakpoint`);
    if (this._intervalFn) {
      clearInterval(this._intervalFn);
    }
  }
}
