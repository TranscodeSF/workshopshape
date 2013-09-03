Meteor.methods({
  saveAnswer: function (question, code) {
    check(question, String);
    check(code, String);
    var answer = Answers.findOne({
      user: Meteor.userId(),
      question: question
    });
    if (!answer) {
      Answers.insert({
        user: Meteor.userId(),
        question: question,
        answer: code,
        results: {} // name -> description, status, [expected], [actual]
      });
    } else {
      Answers.update(answer._id, {$set: {
        answer: code
      }});
    }
  }
});
