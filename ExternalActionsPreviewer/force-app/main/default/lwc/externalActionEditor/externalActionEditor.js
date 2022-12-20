import { api, LightningElement, wire } from "lwc";
import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext,
  publish
} from "lightning/messageService";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import { refreshApex } from "@salesforce/apex";
import fetchExternalActionDetails from "@salesforce/apex/PreviewerSelectorController.fetchExternalActionDetails";
import saveExternalActionActionSchema from "@salesforce/apex/PreviewerEditorController.saveExternalActionActionSchema";
import externalActionActionSchemaUpdated from "@salesforce/messageChannel/externalActionActionSchemaUpdated__c";
import externalActionRecordSelected from "@salesforce/messageChannel/externalActionRecordSelected__c";
import codeMirror from "@salesforce/resourceUrl/codeMirror";
import { initializeEditor } from "c/codeMirrorLib";

export default class ExternalActionEditor extends LightningElement {
  Id;
  options = {};
  codemirror;
  wiredExternalAction;
  _externalActionActionSchema;
  _recordChangeDatetime;
  codemirrorIsClean = true;
  DELAY = 500;
  timer;
  hasErrors;

  @api
  get recordChangeDatetime() {
    return this._recordChangeDatetime;
  }
  set recordChangeDatetime(value) {
    this._recordChangeDatetime = value;
    refreshApex(this.wiredExternalAction);
  }

  get externalActionActionSchema() {
    return this._externalActionActionSchema;
  }
  set externalActionActionSchema(value) {
    this._externalActionActionSchema = value;
  }
  get showEditor() {
    return this._externalActionActionSchema &&
      this._externalActionActionSchema !== ""
      ? "slds-is-expanded slds-card_boundary"
      : "slds-is-collapsed";
  }
  get saveDisabled() {
    return this.codemirrorIsClean || this.buttonsDisabled;
  }
  get buttonsDisabled() {
    return this.hasErrors || !this.Id;
  }

  connectedCallback() {
    loadScript(this, codeMirror + "/lib/codemirror.js")
      .then(() => {
        Promise.all([
          loadScript(this, codeMirror + "/addon/edit/matchbrackets.js"),
          loadScript(this, codeMirror + "/addon/edit/closebrackets.js"),
          loadScript(this, codeMirror + "/addon/fold/foldcode.js"),
          loadScript(this, codeMirror + "/addon/fold/foldgutter.js"),
          loadScript(this, codeMirror + "/addon/fold/brace-fold.js"),
          loadScript(this, codeMirror + "/addon/lint/lint.js"),
          loadScript(this, codeMirror + "/addon/lint/json-lint.js"),
          loadScript(this, codeMirror + "/addon/selection/active-line.js"),
          loadScript(this, codeMirror + "/lib/jsonlint.js"),
          loadScript(this, codeMirror + "/mode/javascript/javascript.js"),
          loadStyle(this, codeMirror + "/addon/fold/foldgutter.css"),
          loadStyle(this, codeMirror + "/addon/lint/lint.css"),
          loadStyle(this, codeMirror + "/lib/codemirror.css")
        ]).then(() => {
          this.subscribeToMessageChannel();
          this.codemirror = initializeEditor(this);
        });
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error loading CodeMirror",
            message: error.message || "An unknown error occurred",
            variant: "error"
          })
        );
        console.error("========== connectedCallback error");
      });
  }

  @wire(MessageContext)
  messageContext;

  @wire(fetchExternalActionDetails, { marketingAppExtActionId: "$Id" })
  wiredExternalActions(result) {
    this.wiredExternalAction = result;
    if (
      this.wiredExternalAction &&
      this.wiredExternalAction.data &&
      this.wiredExternalAction.data.ActionSchema
    ) {
      this.externalActionActionSchema =
        this.wiredExternalAction.data.ActionSchema;
    } else {
      this.externalActionActionSchema = "";
    }

    if (this.codemirror) {
      this.codemirror.getDoc().setValue(this.externalActionActionSchema);
      this.codemirror.getDoc().markClean();
      this.codemirrorIsClean = true;
    }
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
    if (message && message.recordId) {
      this.Id = message.recordId;
    } else {
      this.Id = undefined;
      this.externalActionActionSchema = "";
      this.publishExternalActionActionSchema({});
    }
    return this.Id;
  }

  handleSaveButton() {
    this.codemirrorIsClean = true;
    let actionSchema = JSON.stringify(this.codemirror.getDoc().getValue());
    saveExternalActionActionSchema({
      marketingAppExtActionId: this.Id,
      actionSchema: actionSchema
    })
      .then((data) => {
        if (!data) {
          refreshApex(this.wiredExternalAction);
          this.dispatchEvent(
            new ShowToastEvent({
              title: "Action Schema was saved",
              variant: "success"
            })
          );
        } else {
          let result = JSON.parse(data);
          if (result && result.length) {
            throw new Error(result[0].message, {
              cause: result[0].errorCode
            });
          }
          throw new Error("An unknown error occurred", {
            cause: "Unknown Error"
          });
        }
      })
      .catch((error) => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: error.cause,
            message: error.message,
            variant: "error"
          })
        );
        console.error("========== handleSaveButton error");
        this.codemirrorIsClean = false;
      });
  }

  handleFormatButton() {
    this.codemirror
      .getDoc()
      .setValue(
        JSON.stringify(JSON.parse(this.codemirror.getDoc().getValue()), null, 2)
      );
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  publishExternalActionActionSchema = (message) => {
    publish(this.messageContext, externalActionActionSchemaUpdated, message);
  };
}
