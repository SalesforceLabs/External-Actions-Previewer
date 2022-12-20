({
  init: function () {},
  handleRecordChange: function (cmp, event, helper) {
    if (event.getType() === "force:recordChange") {
      cmp.set("v.recordChangeDatetime", Date.now());
    }
  }
});