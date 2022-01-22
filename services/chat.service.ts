import { FilterQuery, QueryOptions, UpdateQuery} from "mongoose";
import ChatModel, {ChatDocument, ChatInput} from "../models/chat.model";

export async function createChat(input: ChatInput){
    return ChatModel.create(input);
}

export async function getAllChats(
    query: FilterQuery<ChatDocument>,
    options: QueryOptions = { lean : false }){

    return ChatModel.find(query, {}, options);
}

export async function findChat(
    query: FilterQuery<ChatDocument>,
    options: QueryOptions = { lean : false }){

    return ChatModel.findOne(query, {}, options);
}

export async function findAndUpdateChat(
    query: FilterQuery<ChatDocument>,
    update: UpdateQuery<ChatDocument>,
    options: QueryOptions){

    return ChatModel.findOneAndUpdate(query, update, options);
}

export async function deleteChat(
    query: FilterQuery<ChatDocument>){

    return ChatModel.deleteOne(query);
}