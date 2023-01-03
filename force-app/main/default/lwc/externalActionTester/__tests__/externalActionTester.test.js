import { createElement } from "lwc";
import ExternalActionTester from "c/externalActionTester";
import { publish, MessageContext } from "lightning/messageService";
import externalActionActionSchemaUpdated from "@salesforce/messageChannel/externalActionActionSchemaUpdated__c";

const mockActionActionSchemaUpdatedData = require("./data/externalActionActionSchemaUpdatedData.json");

describe("pi_ea_utils-external-action-tester", () => {
  async function flushPromises() {
    return Promise.resolve();
  }

  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("should successfully render", () => {
    // Arrange
    const element = createElement("pi_ea_utils-external-action-tester", {
      is: ExternalActionTester
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const card = element.shadowRoot.querySelector("lightning-card");
    expect(card).not.toBeNull();
  });

  it("should handleMessage successfully", async () => {
    // Arrange
    const element = createElement("pi_ea_utils-external-action-tester", {
      is: ExternalActionTester
    });

    // Act
    document.body.appendChild(element);
    publish(
      MessageContext,
      externalActionActionSchemaUpdated,
      mockActionActionSchemaUpdatedData
    );
    await flushPromises();

    // Assert
    const title = element.shadowRoot.querySelector(
      "div.external-action-tester-title"
    );
    expect(title.textContent).toBe("Custom Ext Action");
  });
});
