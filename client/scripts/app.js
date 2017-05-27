var app = $(document).ready(function() {
  //var $text = $('.text').find(input).val();
  //var $text = 'test message'
  var username = window.location.search;
  var $message = {
    username: 'testname',
    text: $text,
    roomname: 'test'
  };
  var $username, $text, $roomname;

});

app.server='http://parse.hrr.hackreactor.com/chatterbox/classes/messages';

//username = href
//text -- input to string?
//roomname.append to message
$('.send').on('click', function(){

});
var testMessage = {
  username: 'test',
  text: 'ipsum lorem',
  roomname: 'test'
};

app.send = function(message){
  /*
  $.post("http://parse.hrr.hackreactor.com/chatterbox.classes/messages",
    message
  );
  */
  $.ajax({
    url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};
app.send(testMessage);


app.fetch = function(message) {
  $.ajax({
    url: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
    type: 'GET',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message received');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message', data);
    }
  });
};
app.fetch();