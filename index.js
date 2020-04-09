const Discord = require("discord.js");
const ytdl = require("ytdl-core");

const { prefix, token } = require("./config.js");
const dialogues = require("./nagu/dialogues");
const dialoguesSounds = require("./nagu/dialoguesSounds");
const { sayaries } = require("./nagu/sayari");
const { random } = require("./lib");

const client = new Discord.Client();

client.login(token);

client.once("ready", () => {
  console.log("Ready!");
});
client.once("reconnecting", () => {
  console.log("Reconnecting!");
});
client.once("disconnect", () => {
  console.log("Disconnected!");
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const command = message.content.split(" ")[1];

  if (command == "sayari") {
    message.channel.send(random(sayaries));
  } else if (command == "dialogue") {
    message.channel.send(random(dialogues));
  } else if (command == "help") {
    message.channel.send(
      "Nagu The Legend Bot Commands (@nagu)\n1. bol - Nagu talks his lines.\n2. dialogue - Nagu delivers his dialogues\n3. sayari - Nagu's famous sayaries.\n4. play [songUrl] - play song from youtube with youtube link"
    );
  } else if (command == "bol") {
    joinVoice(message);
  } else if (message.content.startsWith(prefix + " play")) {
    playSong(message);
  } else {
    message.channel.send("Enter valid command. Type ' !nagu help ' for help");
  }
});

async function joinVoice(message) {
  const voiceChannel = message.member.voice.channel;

  if (!voiceChannel)
    return message.channel.send("You need to be in a voice channel to play");

  const permissions = voiceChannel.permissionsFor(message.client.user);

  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "Nagu needs the permissions to join and speak in your voice channel!"
    );
  }

  voiceChannel.join().then((connection) => {
    connection.play(random(dialoguesSounds), { 
      volume: 1,
      bitrate:'auto'
     });
  });
}

async function playSong(message) {
  const voiceChannel = message.member.voice.channel;

  if (!voiceChannel)
    return message.channel.send("You need to be in a voice channel to play");

  const permissions = voiceChannel.permissionsFor(message.client.user);

  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songUrl = message.content.split(" ")[2];

  if (!songUrl) {
    return message.channel.send(
      `No song link specified. Type ' !nagu help ' for help`
    );
  }

  console.log(`Playing song url ${songUrl}`);
  message.channel.send(`Playing song url ${songUrl}`);

  voiceChannel.join().then((connection) => {
    connection.play(
      ytdl(songUrl, {
        quality: "highestaudio",
      }),
      {
        volume: 1,
        bitrate:'auto'
      }
    );
  });
}
