userIsAdmin = function (userId) {
  var user = userId ? Meteor.users.findOne(userId) : Meteor.user();
  if (!user) return false;
  var username = user.services && user.services.github && user.services.github.username;
  return _.contains(["ayust", "ariaBennett", "sixolet"], username); // XXX: HARDCODE!!!
};
