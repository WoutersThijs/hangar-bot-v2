import needle = require('needle')
import dotenv from 'dotenv'
import * as ChatService from './chat.service'
import ChatModel, {ChatDocument, ChatInput} from "../models/chat.model";
import { Client, TextChannel } from 'discord.js';
import DiscordJS from 'discord.js'

const rules_URL = 'https://api.twitter.com/2/tweets/search/stream/rules'
const stream_URL = 'https://api.twitter.com/2/tweets/search/stream?tweet.fields=attachments,author_id,entities&expansions=attachments.media_keys'

export async function getRules(){
    const response = await needle('get', rules_URL, {
        headers: {
            Authorization: `Bearer ${process.env.TWITTER_TOKEN}`
        }
    })

    return response.body
}

export async function setRules(rules: any){
    const data = {
        add: rules
    }

    const response = await needle('post', rules_URL, data, {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.TWITTER_TOKEN}`
        }
    })
    
    return response.body
}

export async function deleteRules(rules: any){
    if(!Array.isArray(rules.data)){
        return null
    }

    const ids = rules.data.map((rule: any) => rule.id)

    const data = {
        delete: {
            ids: ids
        }
    }

    const response = await needle('post', rules_URL, data, {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${process.env.TWITTER_TOKEN}`
        }
    })
    
    return response.body
}

export async function streamTweets(client: DiscordJS.Client){
    const stream = needle.get(stream_URL, {
        headers: {
            Authorization: `Bearer ${process.env.TWITTER_TOKEN}`
        }
    })

    stream.on('data', async (chat_data) => {
        try {
            const json = JSON.parse(chat_data)
            console.log(json.data)
            const response = await needle.get("https://api.twitter.com/2/users/" + json.data.author_id, {
                headers: {
                    Authorization: `Bearer ${process.env.TWITTER_TOKEN}`
                }
            });

            response.on('data', async (user_data) => {
                try{
                    const tweet_username: String = user_data.data.username.toLowerCase();
                    let all_chats = await ChatService.getAllChats({})

                    for(let chat of all_chats){
                        if(chat.twitter_enabled == true && chat.twitter_accounts.includes(tweet_username)){
                            const channel = client.channels.cache.get('' + chat.discord_id) as TextChannel;
                            channel.send("https://twitter.com/" + tweet_username + "/status/" + json.data.id);
                            // channel.send("**@" + tweet_username + "** \n" + tweet_text)
                        }
                    }

                } catch (error){
                    console.log(error)
                }
            });

        } catch (error) {
            console.log(error)
        }
    })
    
}