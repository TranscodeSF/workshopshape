/// This file for hardcoded questions on the server.

Meteor.startup(function () {
  if (!Questions.findOne()) {
    var q = Questions.insert({
      name: "First question",
      text: "Write code to output the integers from 0 to 9, one on each line",
      initialCode: "for i in range(10):\n  pass\n",
      tests: [
        {
          type: "matchOutput",
          name: "Output correct",
          body: "0\n1\n2\n3\n4\n5\n6\n7\n8\n9\n"
        }
      ]
    });
    var w = Worksheets.insert({
      name: "Welcome",
      questions: [q]
    });
  }
});
