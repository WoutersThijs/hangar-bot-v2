import DiscordJS, { Intents } from 'discord.js'
import connect from './utils/mongo'
import dotenv from 'dotenv'

dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on('ready', () => {
    console.log('Bot is ready.')

    connect();

    const guild_id = '844200833603076097'
    const guild = client.guilds.cache.get(guild_id)
    let commands

    if(guild){
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    commands?.create({
        name: 'hbstatus',
        description: 'Shows a list of twitter accounts that get retweeted.',
    })

    commands?.create({
        name: 'hbadd',
        description: 'Adds a Twitter account to the list..',
        options: [{
            name: 'twitter_account',
            description: 'Twitter account name to add.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }]
    })
})

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()) return

    const { commandName, options } = interaction

    if(commandName === 'hbstatus'){
        interaction.reply({
            content: 'Chat status',
            ephemeral: true
        })
    }
})

client.login(process.env.DISCORD_BOT_TOKEN)