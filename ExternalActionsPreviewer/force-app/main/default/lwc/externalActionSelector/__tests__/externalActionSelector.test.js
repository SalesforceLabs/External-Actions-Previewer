import { createElement } from "lwc";
import ExternalActionSelector from "c/externalActionSelector";
import fetchExternalActionsByName from "@salesforce/apex/PreviewerSelectorController.fetchExternalActionsByName";
import { setImmediate } from "timers";
import { publish } from "lightning/messageService";

jest.mock(
  "@salesforce/apex/PreviewerSelectorController.fetchExternalActionsByName",
  () => {
    const { createApexTestWireAdapter } = require("@salesforce/sfdx-lwc-jest");
    return {
      default: createApexTestWireAdapter(jest.fn())
    };
  },
  { virtual: true }
);

const mockWiredExternalActions = require("./data/fetchExternalActionsByNameData.json");

describe("pi_ea_utils-external-action-selector", () => {
  const flushPromises = () => new Promise(setImmediate);

  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("should successfully render", () => {
    // Arrange
    const element = createElement("pi_ea_utils-external-action-selector", {
      is: ExternalActionSelector
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const div = element.shadowRoot.querySelector("div");
    expect(div).not.toBeNull();
  });

  it("should fetchExternalActionDetails successfully", async () => {
    // Arrange
    const element = createElement("pi_ea_utils-external-action-selector", {
      is: ExternalActionSelector
    });

    // Act
    document.body.appendChild(element);
    await flushPromises();
    fetchExternalActionsByName.emit(mockWiredExternalActions);
    const input = element.shadowRoot.querySelector("lightning-input");
    await input.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: "test" }
      })
    );

    // Assert
    const opts = element.shadowRoot.querySelectorAll("li");
    expect(opts.length).toBe(3);
  });

  it("should handleSelectExternalAction successfully", async () => {
    // Arrange
    const element = createElement("pi_ea_utils-external-action-selector", {
      is: ExternalActionSelector
    });

    // Act
    document.body.appendChild(element);
    await flushPromises();
    fetchExternalActionsByName.emit(mockWiredExternalActions);
    const input = element.shadowRoot.querySelector("lightning-input");
    await input.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: "test" }
      })
    );
    const opts = element.shadowRoot.querySelector("li");
    opts.click();

    // Assert
    expect(publish).toBeCalled();
  });
});
