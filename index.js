var mc = require('minecraft-protocol');
var fs = require('fs');
var sys = require("sys");
var states = mc.protocol.states;

var data = JSON.parse(fs.readFileSync('data.json'));

var client = mc.createClient(data);

client.on('chat', function(packet) {
  // Listen for chat messages and echo them back.
  var jsonMsg = JSON.parse(packet.message);
  //console.log(jsonMsg)
  jsonMsg.extra.forEach(function(msg){
    process.stdout.write(msg.text);
  });
  console.log(jsonMsg.text);
});


var stdin = process.openStdin();

stdin.addListener("data", function(d) {
  var string = d.toString().substring(0, d.length-1);
  if(!client.write([states.PLAY, 0x01], { message: string })){
    console.log("you said: " + string + "");
  }

});