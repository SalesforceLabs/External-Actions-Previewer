const afterLintChecks = (component) => {
  return (_annotationsNotSorted, annotations) => {
    if (component.codemirror && annotations.length === 0) {
      component.hasErrors = false;
      component.codemirrorIsClean = component.codemirror.getDoc().isClean();
      component.publishExternalActionActionSchema({
        actionSchema: component.codemirror.getDoc().getValue(),
        actionSelector: component.wiredExternalAction.data.ActionSelector,
        actionParams: component.wiredExternalAction.data.ActionParams,
        actionName: component.wiredExternalAction.data.ActionName
      });
    } else if (
      component.codemirror &&
      component.codemirror.getDoc().getValue() !== ""
    ) {
      component.codemirrorIsClean = true;
      component.hasErrors = true;
      component.publishExternalActionActionSchema({
        actionName: component.wiredExternalAction.data.ActionName,
        error: component.hasErrors
      });
    }
  };
};

const initializeEditor = (component) => {
  const container = component.template.querySelector(".codemirror-container");
  const editor = new window.CodeMirror.fromTextArea(
    container,
    Object.assign(
      {
        value: "",
        autoCloseBrackets: true,
        foldGutter: true,
        gutters: [
          "CodeMirror-linenumbers",
          "CodeMirror-foldgutter",
          "CodeMirror-lint-markers"
        ],
        lineNumbers: true,
        lineWrapping: true,
        lint: {
          highlightLines: true,
          onUpdateLinting: afterLintChecks(component)
        },
        matchBrackets: true,
        mode: "application/json",
        styleActiveLine: true
      },
      component.options
    )
  );

  return editor;
};

export { initializeEditor };
