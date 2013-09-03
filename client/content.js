Template.content.loggedIn = function () {
  return Meteor.userId();
};

Template.content.activeWorkshop = Template.navbar.activeWorkshop = function () {
  return Session.get('activeWorkshop');
};

Template.navbar.isAdmin = function () {
  return userIsAdmin();
};

Template.navbar.editingActive = function () {
  return activeIfTrue(Session.get('editingActive'));
};

Template.navbar.events({
  'click .toggleEdit': function () {
    Session.set('editingActive', !Session.get('editingActive'));
  },
  'submit': function (evt, templ) {
    evt.preventDefault();
    evt.stopPropagation();
    var workshopName = templ.find('.workshopNameInput').value;
    var workshop = Workshops.findOne(workshopName);
    if (workshop) {
      Session.set('activeWorkshop', workshopName);
    } else if (userIsAdmin()) {
      workshop = {_id: workshopName, worksheets: []};
      Workshops.insert(workshop);
      Session.set('activeWorkshop', workshopName);
    }
    if (_.isEmpty(workshop.worksheets)) {
      Meteor.call('addWorksheet', workshopName, function (err, res) {
        Session.set('selectedWorksheet', res);
      });
    } else {
      Session.set('selectedWorksheet', workshop.worksheets[0]);
    }

  }
});


Template.chooseWorkshop.events({
  'submit': function (evt, templ) {
    evt.preventDefault();
    evt.stopPropagation();
    var workshopName = templ.find('.workshopNameInput').value;
    if (Workshops.findOne(workshopName)) {
      Session.set('activeWorkshop', workshopName);
    }
    return false;
  }
});
