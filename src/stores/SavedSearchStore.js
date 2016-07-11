import * as SearchClient from "../clients/SearchClient";

export class SavedSearchStore {
  constructor() {
    this.CHANGE_EVENT = "change";
    this.eventEmitter = new EventEmitter();

    this.setSavedSearchUrl("/jobseekers/saved_searches");

    SearchClient.getSavedSearches(this.getSavedSearchUrl(), this.setSavedSearches.bind(this));
  }

  getSavedSearchUrl() {
    return this.savedSearchUrl;
  }

  setSavedSearchUrl(savedSearchUrl) {
    this.savedSearchUrl = savedSearchUrl;
  }

  getSavedSearches() {
    return this.savedSearches;
  }

  setSavedSearches(savedSearches) {
    this.savedSearches = savedSearches;
  }

  emitChange() {
    this.eventEmitter.emit(this.CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.eventEmitter.on(this.CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.eventEmitter.removeListener(this.CHANGE_EVENT, callback);
  }
}
