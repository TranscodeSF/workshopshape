Template.sidebar.worksheets = function () {
  var workshop = Workshops.findOne(Session.get('activeWorkshop'));
  if (!workshop)
    return [];
  return _.map(workshop.worksheets, function (wkstId) {
    return Worksheets.findOne(wkstId);
  });
};

Template.sidebar.worksheetActive = function () {
  return activeIfTrue(Session.equals('selectedWorksheet', this._id));
};

Template.sidebar.editing = function () {
  return Session.get('editingActive');
};

Template.sidebar.events({
  'click .selectWorksheet': function (evt, templ) {
    Session.set('selectedWorksheet', this._id);
  },
  'click .removeWorksheet': function (evt, templ) {
    evt.stopPropagation();
    Meteor.call('removeWorksheet', Session.get('activeWorkshop'), this._id);
  },
  'click .raiseWorksheet': function (evt, templ) {
    evt.stopPropagation();
    Meteor.call('raiseWorksheet', Session.get('activeWorkshop'), this._id);
  },
  'click .addWorksheet': function (evt, templ) {
    Meteor.call('addWorksheet', Session.get('activeWorkshop'));
  }
});
