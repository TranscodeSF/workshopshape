Template.content.loggedIn = function () {
  return Meteor.userId();
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
  }
});
