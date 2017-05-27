var app = $(document).ready(function(){
  var $message = {
    username: '',
    text: '',
    roomname: ''
  };
  var $username;
  var $text;
  var $roomname;

});

app.stringifyMessage = function(message) {
  return JSON.stringify(message);
};

app.send = function(message){
  $.ajax({
    url: 'http://parse.HRR.hackreactor.com/chatterbox.classes/messages',
    type: 'POST',
    DATA: JSON.stringify(message),
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
app.stringifyMessage($message);
