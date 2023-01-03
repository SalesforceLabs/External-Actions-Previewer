({
  init: function () {},
  handleRecordChange: function (cmp, event) {
    if (event.getType() === "force:recordChange") {
      cmp.set("v.recordChangeDatetime", Date.now());
    }
  }
});
