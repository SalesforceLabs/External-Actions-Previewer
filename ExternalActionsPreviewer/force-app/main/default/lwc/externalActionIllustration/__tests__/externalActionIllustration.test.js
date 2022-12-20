import { createElement } from "lwc";
import ExternalActionIllustration from "c/externalActionIllustration";

describe("pi_ea_utils-external-action-illustration", () => {
  const dataSet = [
    { type: "walkthroughNotAvailable", selector: "walkthrough-not-available" },
    { type: "pageNotAvailable", selector: "page-not-available" }
  ];

  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  async function flushPromises() {
    return Promise.resolve();
  }

  it.each(dataSet)(
    "should render specific icon",
    async ({ type, selector }) => {
      // Arrange
      const element = createElement(
        "pi_ea_utils-external-action-illustration",
        {
          is: ExternalActionIllustration
        }
      );

      // Act
      document.body.appendChild(element);
      const desertSvg = element.shadowRoot.querySelector("svg.desert");
      element.type = type;
      await flushPromises();

      // Assert
      const iconSvg = element.shadowRoot.querySelector("svg." + selector);
      expect(desertSvg).not.toBeNull();
      expect(iconSvg).not.toBeNull();
    }
  );
});
