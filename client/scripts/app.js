var app = $(document).ready(function() {
  app.username = window.location.search.substr(10) || 'anonymous';
  app.server = 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages';
  app.roomname = 'lobby';
  app.messages = [];
  app.lastMessageId = 0;
  // Cache jQuery selectors
  app.$message = $('#message');
  app.$chats = $('#chats');
  app.$roomSelect = $('#roomSelect');
  app.$send = $('#send .submit');
  app.$username = $('.username');
  app.$createRoom = $('#createRoom');
  app.$newRoom = $('.newRoom');
  app.$roomName = $('.roomName');
  //var $text = $('.text').find(input).val();
  //var $text = 'test message'
  app.$rooms = {};
  app.$friends = {};

  $('#main').on('click', app.$username, function() {
    app.handleUsernameClick($(this).text());
  });

  //roomname.append to message
  $('#main').on('submit', app.$send, app.handleSubmit);
  //app.$send.on('submit', function(event) {
  //  app.handleSubmit(event);
  //});

  $('nav').on('submit', app.$createRoom, function(event) {
    app.handleNewRoom(event, app.$newRoom.val());
  });

  $('nav').on('click', app.$roomName, app.handleRoomChange);

  // setInterval(function() {
  //   app.fetch();
  // }, 3000);

});

var testMessage = {
  username: 'test',
  text: 'ipsum lorem',
  roomname: 'test'
};

app.send = function(message) {

  $.ajax({
    url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function () {
      app.$message.val('');
      app.fetch();
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function(message) {
  $.ajax({
    url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    success: function (data) {
      if (!data.results || !data.results.length) { return; }

      //store messages for caching later
      app.messages = data.results;

      var mostRecentMessage = app.messages[app.messages.length - 1];

      if (mostRecentMessage.objectID !== app.lastMessageId) {
        app.renderMessages(app.messages);
        console.log('chatterbox: Message received');
      }
    },
    error: function (error) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error(error);
    }
  });
};

app.clearMessages = function() {
  $('#chats').empty();
};

app.renderMessages = function(messages) {

  app.clearMessages();

  messages.forEach(app.renderMessage);
};

app.renderMessage = function(message) {
  var $chat = $('<div class="chat"/>');

  var $username = $('<span class="username">' + message.username + '</span>');
  $username.appendTo($chat);

  var $message = $('<br><span>' + message.text + '</span>');
  $message.appendTo($chat);

  app.$chats.append($chat);
};

app.handleSubmit = function (event) {
  var message = {
    username: app.username,
    text: app.$message.val(),
    roomname: app.roomname || 'lobby'
  };

  app.send(message);
  event.preventDefault();
};

app.renderRoom = function(roomname) {
  //<li><a href="#">One more separated link</a></li>
  if (!app.$rooms.hasOwnProperty(roomname)) {
    var $option = $('<li class="roomName"><a href="#"></a></li>').val(roomname).text(roomname);
    app.$roomSelect.append($option);
    app.$rooms[roomname] = true;
  }
  app.$newRoom.val('');
};

app.handleRoomChange = function(event) {
  var selectIndex = app.$roomSelect.prop('selectedIndex');
  console.log(selectIndex);
  if (selectIndex === 0) {
    var roomname = prompt('Enter room name');
    if (roomname) {
      app.roomname = roomname;
      app.renderRoom(roomname);
      app.$roomSelect(roomname);
    }
  }
};

app.handleNewRoom = function(event, roomname) {
  event.preventDefault();
  app.renderRoom(roomname);
};

app.handleUsernameClick = function(username) {
  //when username clicked adds username to friends list
  this.$friends[username] = true;
};