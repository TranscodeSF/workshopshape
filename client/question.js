var runners = {};

Template.question.created = function () {
  var self = this;
  console.log("created");
  self.save = function () {
    console.log("Autosaving...");
    var code = self.find(".question-code textarea").value;
  };
  self.autosaveHandle = Meteor.setInterval(_.bind(self.save, self), 30*1000);
  runners[self.data._id] = self.runner = new SkulptRunner(self);
};

Template.question.output = function () {
  var self = this;
  return runners[self._id].output() ||
    "[Press \"Run\" to test your code...]";
};

Template.question.destroyed = function () {
  var self = this;
  // clean up
  Meteor.clearInterval(self.autosaveHandle);
  delete runners[self._id];
};

Template.question.events({
  'click .runButton': function (evt, templ) {
    templ.save();
    var codeElt = templ.find('.question-code textarea');
    var code = codeElt.value;
    templ.runner.setCode(code);
    console.log('running');
    templ.runner.run();
  }
});
