class BLRocker {
  queue = [];

  rejectResolver;
  rejectDetector;

  loopRun = false;
  
  constructor(rejectResolver, rejectDetector) {
    this.rejectResolver = rejectResolver;
    this.rejectDetector = rejectDetector;
  }

  push(task) {
    this.queue.push(task);

    if (!this.loopRun) {
      this.loop();
    }
  }

  async loop() {
    this.loopRun = true;

    if (!this.queue.length) {
      this.loopRun = false;
      return;
    }

    const task = this.queue.shift();

    let result = await this.runTask(task);

    if (this.rejectDetector(result)) {
      await this.rejectResolver();
      result = await this.runTask(task);
    }

    this.loop();
  }

  async runTask(task) {
    let result = null;

    if (task instanceof Array) {
      result = await Promise.all(task);
    } else {
      result = await task();
    }

    return result;
  }
}

module.exports = { BLRocker };