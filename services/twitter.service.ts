import needle = require('needle')
import dotenv from 'dotenv'

const rules_URL = 'https://api.twitter.com/2/tweets/search/stream/rules'
const stream_URL = 'https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics'
const rules = [{value: 'from:thijswoutersss'}];

export async function getRules(){
    const response = await needle('get', rules_URL, {
        headers: {
            Authorization: `Bearer ${process.env.TWITTER_TOKEN}`
        }
    })

    console.log(response.body)
    return response.body
}

export async function setRules(){
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

export async function streamTweets(){
    const stream = needle.get(stream_URL, {
        headers: {
            Authorization: `Bearer ${process.env.TWITTER_TOKEN}`
        }
    })

    stream.on('data', (data) => {
        try {
            const json = JSON.parse(data)
            console.log(json)
        } catch (error) { }
    })
}