import { createElement } from "lwc";
import ExternalActionEditor from "c/externalActionEditor";
import fetchExternalActionDetails from "@salesforce/apex/PreviewerSelectorController.fetchExternalActionDetails";
import saveExternalActionActionSchema from "@salesforce/apex/PreviewerEditorController.saveExternalActionActionSchema";
import { publish, MessageContext } from "lightning/messageService";
import externalActionRecordSelected from "@salesforce/messageChannel/externalActionRecordSelected__c";
import { setImmediate } from "timers";
import { refreshApex } from "@salesforce/apex";
import { loadScript } from "lightning/platformResourceLoader";

const windowSpy = jest.spyOn(global, "window", "get");
const mockWiredExternalActions = require("./data/fetchExternalActionDetailsData.json");
const mockActionSchema = require("./data/actionSchemaData.json");
let mockScriptSuccess = true;

jest.mock(
  "@salesforce/apex",
  () => {
    return {
      refreshApex: jest.fn(() => Promise.resolve())
    };
  },
  { virtual: true }
);
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
jest.mock(
  "@salesforce/apex/PreviewerEditorController.saveExternalActionActionSchema",
  () => {
    return {
      default: jest.fn(() => Promise.resolve())
    };
  },
  { virtual: true }
);
jest.mock(
  "lightning/platformResourceLoader",
  () => {
    return {
      loadScript() {
        return new Promise((resolve, reject) => {
          if (!mockScriptSuccess) {
            reject("Could not load script");
          } else {
            resolve();
          }
        });
      },
      loadStyle() {
        return new Promise((resolve) => {
          resolve();
        });
      }
    };
  },
  { virtual: true }
);

describe("pi_ea_utils-external-action-editor", () => {
  const flushPromises = () => new Promise(setImmediate);

  beforeAll(() => {
    const mockedFromTextArea = jest.fn((container) => ({
      getDoc: jest.fn(() => ({
        isClean: jest.fn(() => true),
        getValue: jest.fn(() => mockActionSchema),
        setValue: jest.fn((value) => {
          container.value = value;
          container.dispatchEvent(new CustomEvent("change"));
        })
      }))
    }));
    const originalWindow = { ...window };

    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      CodeMirror: {
        fromTextArea: mockedFromTextArea
      }
    }));
  });

  afterAll(() => {
    windowSpy.mockRestore();
  });

  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("should render component", () => {
    // Arrange
    const element = createElement("pi_ea_utils-external-action-editor", {
      is: ExternalActionEditor
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const textarea = element.shadowRoot.querySelector(
      "textarea.codemirror-container"
    );
    expect(textarea).not.toBeNull();
  });

  it("should handleMessage successfully and unsuccessfully", async () => {
    // Arrange
    const element = createElement("pi_ea_utils-external-action-editor", {
      is: ExternalActionEditor
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
      undefined
    );

    // Assert
    expect(unsuccessfulId).toBe(undefined);
  });

  it("should fetchExternalActionDetails successfully", async () => {
    // Arrange
    const element = createElement("pi_ea_utils-external-action-editor", {
      is: ExternalActionEditor
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const textarea = element.shadowRoot.querySelector(
      "textarea.codemirror-container"
    );
    expect(textarea).not.toBeNull();
    expect(
      element.shadowRoot.querySelector("section.slds-is-expanded")
    ).toBeNull();

    // Act
    fetchExternalActionDetails.emit(mockWiredExternalActions);
    await flushPromises();

    // Assert
    expect(
      element.shadowRoot.querySelector("section.slds-is-expanded")
    ).not.toBeNull();
  });

  it("should recordChangeDatetime successfully", async () => {
    // Arrange
    const element = createElement("pi_ea_utils-external-action-editor", {
      is: ExternalActionEditor
    });
    const currDatetime = Date.now();

    // Act
    document.body.appendChild(element);
    await flushPromises();
    element.recordChangeDatetime = currDatetime;

    // Assert
    expect(element.recordChangeDatetime).toBe(currDatetime);
    expect(refreshApex).toBeCalled();
  });

  it("should handleSaveButton successfully", async () => {
    // Arrange
    const element = createElement("pi_ea_utils-external-action-editor", {
      is: ExternalActionEditor
    });

    // Act
    document.body.appendChild(element);
    await flushPromises();
    const saveButton = element.shadowRoot.querySelector(
      'lightning-button[title="Save"]'
    );
    saveButton.click();

    // Assert
    expect(saveExternalActionActionSchema).toBeCalled();
  });

  it("should loadScript unsuccessfully", async () => {
    // Arrange
    mockScriptSuccess = false;
    const element = createElement("pi_ea_utils-external-action-editor", {
      is: ExternalActionEditor
    });

    // Act
    document.body.appendChild(element);

    // Assert
    await expect(loadScript).rejects.toBe("Could not load script");
  });
});
