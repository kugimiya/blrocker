export class BLRocker<PType> {
  queue: Array<() => Promise<PType> | Promise<PType>[]> = [];

  rejectResolver: () => Promise<PType>;
  rejectDetector: (data: PType | PType[]) => boolean;

  loopRun = false;
  
  constructor(
    rejectResolver: () => Promise<PType>, 
    rejectDetector: (data: PType | PType[]) => boolean
  ) {
    this.rejectResolver = rejectResolver;
    this.rejectDetector = rejectDetector;
  }

  push(task: () => Promise<PType> | Promise<PType>[]) {
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

    if (task === undefined) {
      return;
    }
  
    let result = await this.runTask(task);

    if (this.rejectDetector(result)) {
      await this.rejectResolver();
      result = await this.runTask(task);
    }

    this.loop();
  }

  async runTask(task: () => Promise<PType> | Promise<PType>[]): Promise<PType | PType[]> {
    let result: PType | PType[];

    if (task instanceof Array) {
      result = await Promise.all<PType>(task);
    } else {
      result = await (task() as Promise<PType>);
    }

    return result;
  }
}
