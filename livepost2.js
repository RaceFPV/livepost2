if (Meteor.isClient) {
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
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

