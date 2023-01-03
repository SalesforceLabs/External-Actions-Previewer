import { LightningElement, wire } from "lwc";
import fetchExternalActionsByName from "@salesforce/apex/PreviewerSelectorController.fetchExternalActionsByName";
import { publish, MessageContext } from "lightning/messageService";
import externalActionRecordSelected from "@salesforce/messageChannel/externalActionRecordSelected__c";

export default class ExternalActionSearcher extends LightningElement {
  DELAY = 300;
  queryTerm;
  timer;
  externalActions;
  error;
  selectedExternalAction;
  showDropdown = false;
  get shouldShowDropdown() {
    return this.showDropdown && this.externalActions;
  }

  @wire(MessageContext)
  messageContext;

  @wire(fetchExternalActionsByName, { queryTerm: "$queryTerm" })
  wiredExternalActions({ error, data }) {
    if (data && data.length > 0) {
      this.externalActions = data;
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.externalActions = undefined;
    } else {
      this.externalActions = undefined;
    }
  }

  searchExternalActions = (searchTerm) => {
    this.queryTerm = searchTerm;
  };

  handleSearch = (event) => {
    this.showDropdown = true;
    this.debouncedSearch(
      this.DELAY,
      this.searchExternalActions.bind(null, event.target.value)
    );
  };

  debouncedSearch = (time, callback) => {
    clearTimeout(this.timer);
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    this.timer = setTimeout(() => {
      callback();
    }, time);
  };

  handleSelectExternalAction = (event) => {
    this.selectedExternalAction = this.externalActions.filter((ea) => {
      return ea.Id === event.currentTarget.dataset.id;
    })[0];
    this.publishExternalActionRecord(this.selectedExternalAction.Id);
  };

  handleClearSelectedExternalAction = () => {
    this.selectedExternalAction = undefined;
    this.showDropdown = false;
    this.publishExternalActionRecord(this.selectedExternalAction);
  };

  publishExternalActionRecord = (recordId) => {
    publish(this.messageContext, externalActionRecordSelected, {
      recordId
    });
  };

  handleBlur = () => {
    let me = this;
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    setTimeout(() => {
      me.showDropdown = false;
    }, this.DELAY);
  };
}
