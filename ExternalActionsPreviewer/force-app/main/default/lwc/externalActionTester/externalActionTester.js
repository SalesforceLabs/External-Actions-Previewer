import { LightningElement, wire } from "lwc";
import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext,
  publish
} from "lightning/messageService";
import externalActionActionSchemaUpdated from "@salesforce/messageChannel/externalActionActionSchemaUpdated__c";
import externalActionTesterLogged from "@salesforce/messageChannel/externalActionTesterLogged__c";
import invokeExternalAction from "@salesforce/apex/PreviewerTesterController.invokeExternalAction";

export default class ExternalActionTester extends LightningElement {
  actionSchema;
  actionSelector;
  actionParams;
  actionName;
  error;
  actionSchemaView = [];

  @wire(MessageContext)
  messageContext;

  get showIllustrationImage() {
    return !this.actionSchemaView.length || this.error;
  }
  get actionSchemaError() {
    return this.error;
  }
  get actionSchemaViewInvalid() {
    return (
      !this.actionSchemaEmpty &&
      this.actionSchemaView.length === 0 &&
      !this.error
    );
  }
  get actionSchemaEmpty() {
    return !this.actionSchema && !this.error;
  }
  get iconName() {
    return this.actionSchemaEmpty
      ? "standard:record_lookup"
      : this.actionSchemaError
      ? "standard:first_non_empty"
      : "standard:maintenance_work_rule";
  }

  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  disconnectedCallback() {
    this.unsubscribeToMessageChannel();
  }

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        externalActionActionSchemaUpdated,
        (message) => this.handleMessage(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  unsubscribeToMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  handleMessage(message) {
    try {
      this.error = message.error;
      this.actionSchema = message.actionSchema;
      this.actionSelector = message.actionSelector;
      this.actionName = message.actionName;
      this.actionSchemaView = [];

      let actionSchemaParsed = JSON.parse(this.actionSchema),
        actionSchemaView;
      if (actionSchemaParsed) {
        if (actionSchemaParsed.view && actionSchemaParsed.view.components) {
          actionSchemaView = actionSchemaParsed.view.components.reduce(
            (previous, current) => {
              let nameParts = current.scope.split("/");
              let name = nameParts[2];
              previous[name] = { visible: true };
              return previous;
            },
            {}
          );
        } else {
          return;
        }
        actionSchemaView = this.mergeActionSchemaViewAndProperties(
          actionSchemaView || {},
          actionSchemaParsed.properties || {}
        );
      }
      if (actionSchemaView) {
        this.actionSchemaView = Object.keys(actionSchemaView)
          .map((o) => {
            return {
              key: o,
              disabled: actionSchemaView[o].visible === true ? false : true,
              required:
                actionSchemaParsed.required &&
                actionSchemaParsed.required.length &&
                actionSchemaParsed.required.includes(o)
                  ? true
                  : false,
              ...actionSchemaView[o]
            };
          })
          .filter((property) => {
            return property.type !== undefined;
          });
      }
      this.actionParams = JSON.parse(message.actionParams);
    } catch (e) {
      console.error("========== handleMessage error:", this.actionSchema);
    }
  }

  mergeActionSchemaViewAndProperties(view, properties) {
    let dst = {},
      src,
      p,
      args = [view, properties];
    while (args.length > 0) {
      src = args.splice(0, 1)[0];
      if (src.toString() === "[object Object]") {
        for (p in src) {
          // eslint-disable-next-line no-prototype-builtins
          if (src.hasOwnProperty(p)) {
            if (src[p].toString() === "[object Object]") {
              dst[p] = this.mergeActionSchemaViewAndProperties(
                dst[p] || {},
                src[p]
              );
            } else {
              dst[p] = src[p];
            }
          }
        }
      }
    }
    return dst;
  }

  handleTestButton() {
    const inputParams = [
      ...this.template.querySelectorAll("lightning-input")
    ].map((input) => {
      return {
        id: input.dataset.id,
        value: input.value
      };
    });
    invokeExternalAction({
      actionSelector: this.actionSelector,
      actionParams: this.actionParams,
      inputParams: inputParams
    }).then((result) => {
      try {
        const resultFormatted = JSON.stringify(JSON.parse(result), null, 2);
        this.publishExternalActionLogMessage(resultFormatted);
      } catch (e) {
        this.publishExternalActionLogMessage(e.message);
      }
    });
  }

  publishExternalActionLogMessage = (message) => {
    publish(this.messageContext, externalActionTesterLogged, {
      logMessage: message
    });
  };
}
