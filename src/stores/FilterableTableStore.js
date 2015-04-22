export class FilterableTableStore {
  constructor(configuration) {
    this.CHANGE_EVENT = 'change';
    this.eventEmitter = new EventEmitter();

    this.id = configuration.id;
  }
}
