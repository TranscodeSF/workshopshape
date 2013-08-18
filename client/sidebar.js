Template.sidebar.worksheets = function () {
  return Worksheets.find();
};

Template.sidebar.worksheetActive = function () {
  return activeIfTrue(Session.equals('selectedWorksheet', this._id));
};

Template.sidebar.events({
  'click .selectWorksheet': function (evt, templ) {
    Session.set('selectedWorksheet', this._id);
  }
});
