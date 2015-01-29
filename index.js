var mc = require('minecraft-protocol');
var fs = require('fs');
var sys = require("sys");
var states = mc.protocol.states;

var data = JSON.parse(fs.readFileSync('data.json'));

var client = mc.createClient(data);
console.info('Connecting................')

client.on('connect', function() {
    var server = data.host + (data.port!==null ? ":" + data.port : "");
    console.info('Successfully connected to ' + data.host);
});

client.on([states.PLAY, 0x40], function(packet) {
    console.info('Kicked for ' + packet.reason);
    process.exit(1);
});

client.on('timeout', function(){
  console.log("THE WORLD IS ENDING! Or you just timed out. idk, i'm just a console script.")
  process.exit(1);
})

client.on('chat', function(packet) {
  var jsonMsg = JSON.parse(packet.message);
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