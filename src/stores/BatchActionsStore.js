export class BatchActionsStore {
  constructor(configuration) {
    this.actions = configuration.actions;
  }

  getActions() {
    return this.actions;
  }
}
