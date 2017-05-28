
var app = $(document).ready(function() {
  app.username = window.location.search.substr(10) || 'anonymous';
  app.server = 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages';
  app.roomname = 'lobby';
  app.messages = [];
  app.friends = {};
  app.lastMessageId = 0;
  // Cache jQuery selectors
  app.$message = $('#message');
  app.$chats = $('#chats');
  app.$roomSelect = $('#roomSelect');
  app.$send = $('#send');
  app.$username = $('.username');
  app.$createRoom = $('#createRoom');
  app.$newRoom = $('.newRoom');
  app.$roomName = $('.roomName');
  app.$roomChoices = $('.dropdown').find('#roomSelect').children();
  //var $text = $('.text').find(input).val();
  //var $text = 'test message'
  app.$roomCount = 0;
  app.$rooms = {};

  app.$chats.on('click', app.$username, app.handleUsernameClick);

  app.$send.submit(function(event) {
    app.handleSubmit();
    event.preventDefault();
  });

  $('#createRoom').submit(function(event) {
    app.handleNewRoom(app.$newRoom.val());
    event.preventDefault();
  });

  $('.dropdown-menu').on('click', app.$roomName, function(event) {
    event.preventDefault();
    app.handleRoomChange($(event.target).text());
  });//


  // setInterval(function() {
  //   app.fetch();
  // }, 3000);

});

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
        app.renderRoomList(app.messages);
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

  messages
    .filter(function(message) {
      if (app.roomname === 'lobby' && !message.roomname) {
        return true;
      } else if (message.roomname === app.roomname) {
        return true;
      }
    })
    .forEach(app.renderMessage);
};

app.renderMessage = function(message) {
  var $chat = $('<div class="chat"/>');
  var $username = $('<span class="username"></span>').text(message.username);
  $username.attr('data-username', message.username);
  $username.appendTo($chat);

  var $message = $('<br><span></span>').text(message.text);
  $message.appendTo($chat);
  app.$chats.append($chat);
};

app.renderRoomList = function(messages) {
  if (messages) {
    messages.forEach(function(message) {
      var roomname = message.roomname;
      if (roomname && !app.$rooms[roomname]) {
        app.renderRoom(roomname);
        app.$rooms[roomname] = true;
      }
    });
  }
};

app.handleSubmit = function() {
  var message = {
    username: app.username,
    text: app.$message.text(),
    roomname: app.roomname || 'lobby'
  };
  app.send(message);
};

app.renderRoom = function(roomname) {
  if (!app.$rooms.hasOwnProperty(roomname)) {
    var $option = $('<li class="roomName"><a href="#"></a></li>').text(roomname);
    app.$roomSelect.append($option);
    app.$rooms[roomname] = true;
  }
  app.$newRoom.val('');
};

app.handleRoomChange = function(roomname) {
  //set text equal to var roomname
  app.roomname = roomname;
  app.renderRoom(roomname);
  app.renderMessages(app.messages);
};

app.handleNewRoom = function(roomname) {
  app.renderRoom(roomname);
};

app.handleUsernameClick = function(event) {
  //when username clicked adds username to friends list
  var username = $(event.target).data('username');
  console.log(username);
  if (username !== undefined) {
    app.friends[username] = !app.friends[username];

    var selector = '[data-username="' + username.replace(/"/g, '\\\"' + '"]');
    var $usernames = $(selector).toggleClass('friend');
  }
};