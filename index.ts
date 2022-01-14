import DiscordJS, { Intents } from 'discord.js'
import connect from './utils/mongo'
import dotenv from 'dotenv'
import * as ChatService from './services/chat.service'

dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})

client.on('ready', async () => {
    console.log('Bot is ready.')

    await connect();

    const chat = await ChatService.findChat({discord_id: "882183609275023390"})

    if(chat != null){
        console.log(chat?.discord_id)
    } else {
        const new_chat =await ChatService.createChat({
            discord_id: "882183609275023390",
            twitter_enabled: true,
            twitter_accounts: ["test1", "test2"]
        });
        console.log(new_chat.discord_id)
    }

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

    commands?.create({
        name: 'hbremove',
        description: 'Removes a Twitter account to the list..',
        options: [{
            name: 'twitter_account',
            description: 'Twitter account name to remove.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }]
    })

    commands?.create({
        name: 'hbtoggle',
        description: 'Toggles Twitter listening.'
    })
})

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()) return

    const { commandName, options } = interaction

    if(commandName.slice(0, 2) === "hb"){
        const chat_id = interaction.channelId

        if(await ChatService.findChat({discord_id: chat_id}) == null){
            const new_chat =await ChatService.createChat({
                discord_id: chat_id,
                twitter_enabled: false,
                twitter_accounts: ["test1"]
            });
        }

        const chat = await ChatService.findChat({discord_id: chat_id})

        if(commandName === 'hbstatus'){
            interaction.reply({
                content: '**Listening:** ' + chat?.twitter_enabled + '\n **Accounts:** ' + chat?.twitter_accounts,
                ephemeral: true
            })
        } else if(commandName === 'hbadd'){
            const twitter_account = options.getString("twitter_account")!

            if(chat?.twitter_accounts.includes(twitter_account)){
                interaction.reply({
                    content: 'Already in the list.',
                    ephemeral: true
                })
            } else {
                let new_twitter_accounts: String[] = []

                for(let account in chat?.twitter_accounts){
                    new_twitter_accounts.push(chat?.twitter_accounts[parseInt(account)]!)
                }

                new_twitter_accounts.push(twitter_account)

                await ChatService.findAndUpdateChat({discord_id: chat_id}, {twitter_accounts: new_twitter_accounts}, {})

                interaction.reply({
                    content: 'Added.',
                    ephemeral: true
                })
            }

        } else if(commandName === 'hbremove'){
            const twitter_account = options.getString("twitter_account")!
            
            if(!chat?.twitter_accounts.includes(twitter_account)){
                interaction.reply({
                    content: 'Not in the list.',
                    ephemeral: true
                })
            } else {
                let new_twitter_accounts: String[] = []

                for(let account in chat?.twitter_accounts){
                    if(chat?.twitter_accounts[parseInt(account)!] !== twitter_account){
                        new_twitter_accounts.push(chat?.twitter_accounts[parseInt(account)]!)
                    }
                }

                await ChatService.findAndUpdateChat({discord_id: chat_id}, {twitter_accounts: new_twitter_accounts}, {})

                interaction.reply({
                    content: 'Removed.',
                    ephemeral: true
                })
            }
            
        } else if(commandName === 'hbtoggle'){
           if(chat?.twitter_enabled){
                await ChatService.findAndUpdateChat({discord_id: chat_id}, {twitter_enabled: false}, {})

                interaction.reply({
                    content: 'Listening has been disabled.',
                    ephemeral: true
                })
            } else {
                await ChatService.findAndUpdateChat({discord_id: chat_id}, {twitter_enabled: true}, {})

                interaction.reply({
                    content: 'Listening has been enabled.',
                    ephemeral: true
                })
           }
        }
    }
})

client.login(process.env.DISCORD_BOT_TOKEN)