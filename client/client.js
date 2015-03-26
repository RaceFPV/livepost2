/**
* Templates
*/
Template.messages.helpers({
    messages: function() {
        return Messages.find({}, { sort: { time: 1}});
    }
})

Template.isslocation.helpers({
    isslocations: function() {
      return ISSLocation.find({}, { sort: {time:-1}, limit: 1});
    }
})

Template.input.events = {
  'keydown input#message' : function (event) {
    if (event.which == 13) { // 13 is the enter key event
      if (Meteor.user())
        var name = Meteor.user().profile.name;
      else
        var name = 'Anonymous';
      var message = document.getElementById('message');
 
      if (message.value != '') {
        Messages.insert({
          name: name,
          message: message.value,
          time: Date.now(),
        });
 
        document.getElementById('message').value = '';
        message.value = '';
      }
    }
  }
}

Template.earth.rendered = function() {
	showearth();
}