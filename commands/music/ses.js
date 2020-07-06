const { music_handler } = require("../../index.js");

module.exports.execute = async (client, message, args) => {

    const queue = music_handler.getGuildQueue(message.guild.id); // Get the queue for the guild the cmd was executed in
    if (!queue) return message.reply("⚠️ Şuanda müzik çalmıyor!"); // Tell the user no song is being played

    if (!message.member.voice.channel || message.member.voice.channel != queue.voiceChannel) {
        return message.reply("⚠️ Bu komutu kullanabilmek için botla aynı odada bulunmalısınız!")
    }
    
    let volumeEmoji; // Declare the variable to use the correct emoji so it doesn't have to be declared more than once

    if (!args[0]) {
        volumeEmoji = queue.volume > 50 ? "🔊" : (queue.volume <= 0 ? "🔈" : "🔉"); // Ses emojisi
        message.channel.send(`${volumeEmoji} Ses: **${queue.volume}/100**`); // Kullanıcılara ses seviyesini iletir
        return; // Return so that the rest of the code does not run
    }

    // Make sure the inputs are numbers and, between 0 and 100 only
    if (isNaN(args[0])) return client.commands.get("help").execute(client, message, ["ses"]);
    if (args[0] < 0 || args[0] > 100) return client.commands.get("help").execute(client, message, ["ses"]);

    // Set the volume
    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    volumeEmoji = queue.volume > 50 ? "🔊" : (queue.volume <= 0 ? "🔈" : "🔉"); // Ses emojisi
    message.channel.send(`${volumeEmoji} Ses: **${queue.volume}/100**`); // Kullanıcılara sesin değiştirildiğini iletir.

}

module.exports.help = {
    name: "ses",
    aliases: ["s"],
    category: "Music",
    usage: "[ses (0-100)]",
    description: "Ses çok mu fazla? yada az, bu komutla sesin seviyesini belirleyebilirsin."
}