import { initializeEditor } from "c/codeMirrorLib";

const windowSpy = jest.spyOn(global, "window", "get");

describe("c-code-mirror-lib", () => {
  beforeAll(() => {
    const originalWindow = { ...window };

    windowSpy.mockImplementation(() => ({
      ...originalWindow,
      CodeMirror: {
        fromTextArea: jest.fn((container, config) => {
          return { ...container, ...config };
        })
      }
    }));
  });

  describe("initializeEditor", () => {
    it("should execute initializeEditor successfully", () => {
      // Arrange
      const mockedComponent = jest.fn(() => ({
        template: {
          querySelector: jest.fn(() => ({}))
        },
        publishExternalActionActionSchema: jest.fn(() => {}),
        codemirror: {
          getDoc: jest.fn(() => ({
            isClean: jest.fn(() => true),
            getValue: jest.fn(() => "{}")
          }))
        },
        hasErrors: false,
        codemirrorIsClean: false,
        wiredExternalAction: {
          data: {
            ActionSelector: "{}",
            ActionParams: "{}",
            ActionName: "Some Name"
          }
        }
      }));

      // Act
      const editor = initializeEditor(mockedComponent());

      // Assert
      expect(editor).not.toBe(null);
    });
  });

  describe("afterLintChecks", () => {
    const dataSet = [
      { hasErrors: false, annotations: [] },
      { hasErrors: true, annotations: ["error"] }
    ];

    it.each(dataSet)(
      "should execute afterLintChecks ($hasErrors)",
      ({ hasErrors, annotations }) => {
        // Arrange
        const mockedComponent = jest.fn(() => ({
          template: {
            querySelector: jest.fn(() => ({}))
          },
          publishExternalActionActionSchema: jest.fn(() => {}),
          codemirror: {
            getDoc: jest.fn(() => ({
              isClean: jest.fn(() => true),
              getValue: jest.fn(() => "{}")
            }))
          },
          hasErrors: null,
          codemirrorIsClean: false,
          wiredExternalAction: {
            data: {
              ActionSelector: "{}",
              ActionParams: "{}",
              ActionName: "Some Name"
            }
          }
        }));

        // Act
        let component = mockedComponent();
        const editor = initializeEditor(component);
        editor.lint.onUpdateLinting(null, annotations);

        // Assert
        expect(editor).not.toBe(null);
        expect(component.hasErrors).toBe(hasErrors);
      }
    );
  });
});
