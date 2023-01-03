import { LightningElement, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from "lightning/messageService";
import externalActionRecordSelected from "@salesforce/messageChannel/externalActionRecordSelected__c";
import fetchExternalActionDetails from "@salesforce/apex/PreviewerSelectorController.fetchExternalActionDetails";

export default class ExternalActionRecord extends NavigationMixin(
  LightningElement
) {
  record;
  recordId;
  wiredExternalAction;

  get actionNameUrl() {
    return this.record && this.record.ActionName ? "/" + this.record.Id : "";
  }
  get marketingAppExtensionUrl() {
    return this.record && this.record.MarketingAppExtension
      ? "/" + this.record.MarketingAppExtension.Id
      : "";
  }
  get recordName() {
    return this.record && this.record.ActionName
      ? this.record.ActionName
      : "Select External Action";
  }
  get recordIcon() {
    return this.record
      ? "standard:maintenance_work_rule"
      : "utility:record_lookup";
  }
  get recordTitleStyle() {
    return this.record ? "slds-m-bottom_none" : "slds-m-bottom_none muted";
  }
  get iconName() {
    return this.record.IsActive ? "utility:success" : "utility:ban";
  }
  get iconVariant() {
    return this.record.IsActive ? "success" : "default";
  }
  get editButtonDisabled() {
    return this.record ? false : true;
  }

  @wire(MessageContext)
  messageContext;

  @wire(fetchExternalActionDetails, { marketingAppExtActionId: "$recordId" })
  wiredExternalActions(result) {
    this.wiredExternalAction = result;
    if (this.wiredExternalAction && this.wiredExternalAction.data) {
      this.record = this.wiredExternalAction.data;
    } else {
      this.record = undefined;
    }
  }

  handleEditButton(event) {
    event.preventDefault();
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: this.record.Id,
        actionName: "edit"
      }
    });
  }

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        externalActionRecordSelected,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  handleMessage(message) {
    this.recordId = message.recordId;
    if (!this.recordId) {
      this.record = undefined;
    }
    return this.recordId;
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }
}
