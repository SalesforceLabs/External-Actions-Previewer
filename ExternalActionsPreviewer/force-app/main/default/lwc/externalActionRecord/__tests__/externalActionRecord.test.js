import { createElement } from "lwc";
import ExternalActionRecord from "c/externalActionRecord";
import fetchExternalActionDetails from "@salesforce/apex/PreviewerSelectorController.fetchExternalActionDetails";
import { setImmediate } from "timers";
import { publish, MessageContext } from "lightning/messageService";
import externalActionRecordSelected from "@salesforce/messageChannel/externalActionRecordSelected__c";
import { mockNavigate } from "lightning/navigation";

const mockWiredExternalActions = require("./data/fetchExternalActionDetailsData.json");

jest.mock(
  "@salesforce/apex/PreviewerSelectorController.fetchExternalActionDetails",
  () => {
    const { createApexTestWireAdapter } = require("@salesforce/sfdx-lwc-jest");
    return {
      default: createApexTestWireAdapter(jest.fn())
    };
  },
  { virtual: true }
);

describe("pi_ea_utils-external-action-record", () => {
  const flushPromises = () => new Promise(setImmediate);

  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("should successfully render", () => {
    // Arrange
    const element = createElement("pi_ea_utils-external-action-record", {
      is: ExternalActionRecord
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const card = element.shadowRoot.querySelector("lightning-card");
    expect(card).not.toBeNull();
  });

  it("should fetchExternalActionDetails successfully", async () => {
    // Arrange
    const element = createElement("pi_ea_utils-external-action-record", {
      is: ExternalActionRecord
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const title = element.shadowRoot.querySelector("h1");
    expect(title.textContent).toBe("Select External Action");

    // Act
    fetchExternalActionDetails.emit(mockWiredExternalActions);
    await flushPromises();

    // Assert
    expect(title.textContent).toBe("Custom Ext Action");
  });

  it("should handleMessage successfully", async () => {
    // Arrange
    const element = createElement("pi_ea_utils-external-action-record", {
      is: ExternalActionRecord
    });
    document.body.appendChild(element);
    await flushPromises();

    // Act
    const successfulId = publish(MessageContext, externalActionRecordSelected, {
      recordId: "002"
    });

    // Assert
    expect(successfulId).toBe("002");

    // Act
    const unsuccessfulId = publish(
      MessageContext,
      externalActionRecordSelected,
      {}
    );

    // Assert
    expect(unsuccessfulId).toBe(undefined);
  });

  it("should handleEditButton successfully", async () => {
    // Arrange
    const element = createElement("pi_ea_utils-external-action-record", {
      is: ExternalActionRecord
    });

    // Act
    document.body.appendChild(element);
    fetchExternalActionDetails.emit(mockWiredExternalActions);
    await flushPromises();
    const editButton = element.shadowRoot.querySelector(
      'lightning-button[title="Edit"]'
    );
    editButton.click();

    // Assert
    expect(mockNavigate).toBeCalled();
  });
});
