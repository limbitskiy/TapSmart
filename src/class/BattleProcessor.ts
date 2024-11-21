// types
import { Task, Answer } from "@/types";

export class BattleProcessor {
  private tasks: Task[];
  private taskId: number;
  private _lastTaskId: number;
  private _answers: Answer[];

  constructor() {
    this.tasks = [];
    this.taskId = 0;
    this._answers = [];
    this._lastTaskId = 0;
    this.getNextTask = this.getNextTask.bind(this);
  }

  public setTasks(tasks: Task[]) {
    this.tasks = tasks;
  }

  public reset() {
    this.resetTaskIndex();
    this._lastTaskId = 0;
  }

  private resetTaskIndex() {
    if (!this.tasks) return;
    const clone = JSON.parse(JSON.stringify(this.tasks));

    clone.sort((a: any, b: any) => a.id - b.id);
    this.taskId = clone[0].id;
  }

  public storeAnswer(answerString: string, msec?: number) {
    const task = this.tasks.find((task) => task.id === this.taskId);

    if (!task) {
      console.error(`No such task: battle processor`);
      return;
    }

    const foundIdx = this._answers.findIndex((answer) => answer.id === task!.id);

    if (foundIdx !== -1) {
      this._answers[foundIdx] = {
        id: task.id,
        key: task.key,
        answer: answerString,
        msec,
      };
    } else {
      this._answers.push({
        id: task.id,
        key: task.key,
        answer: answerString,
        msec,
      });
    }

    this._lastTaskId = this.taskId;
  }

  private getNextTask(amount = 0) {
    if (amount) {
    } else {
      const clone = JSON.parse(JSON.stringify(this.tasks));
      clone.sort((a, b) => a.id - b.id);

      const idx = clone.findIndex((task: Task) => task.id === this.taskId);

      const newIdx = idx + 1;

      if (clone[newIdx]) {
        this.taskId = clone[newIdx].id;
      } else {
        this.resetTaskIndex();
      }

      return this.tasks.find((task) => task.id === this.taskId);
    }
  }

  public clearAnswers() {
    this._answers = [];
    this._lastTaskId = 0;
  }

  public getCurrentTask() {
    return this.tasks.find((task) => task.id === this.taskId);
  }

  get answers() {
    return this._answers;
  }
}
