if (Meteor.isClient) {
}


if (Meteor.isServer) {
    Meteor.methods({
        checkIss: function () {
            this.unblock();
            return Meteor.http.call("GET", "http://api.open-notify.org/iss-now.json");
        }
    });
  Meteor.setInterval(function() {
      Meteor.call("checkIss", function(error, results) {
        var result = JSON.parse(results.content)
        ISSLocation.insert({latitude: result.iss_position.latitude, longitude: result.iss_position.longitude, time: Date.now()});
    });
  }, 3000);
}

Router.map( function () {
  this.route('home', {
    path: '/',
    template: 'homeTemplate'
  });
  this.route('about', {
    path: '/about',
    template: 'aboutTemplate'
  });
  this.route('chat', {
    path: '/chat',
    template: 'chatTemplate'
  });
  this.route('messageDetail', {
  // get parameter via this.params
  path: '/messages/:_id'
});
});

