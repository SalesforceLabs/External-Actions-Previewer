import { createElement } from "lwc";
import ExternalActionLogger from "c/externalActionLogger";

describe("pi_ea_utils-external-action-logger", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("should successfully render", () => {
    // Arrange
    const element = createElement("pi_ea_utils-external-action-logger", {
      is: ExternalActionLogger
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const card = element.shadowRoot.querySelector("lightning-card");
    expect(card).not.toBeNull();
  });
});
