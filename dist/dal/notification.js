"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Notifications = require("../models/v1/notification");
const _init_1 = require("./_init");
class NotificationsDAL extends _init_1.default {
    async getMessages(userId, offset) {
        const messages = await this.knex("user_messages").select("id as messageId", "userid_from as userId", "message_subject as subject", "message_body as body", "message_date as date", "message_read as read").where({
            'userid_to': userId,
        }).orderBy('id', 'desc').limit(25).offset(offset);
        return messages;
    }
    async getMessageById(messageId) {
        const message = await this.knex("user_messages").select("id as messageId", "userid_from as userId", "message_subject as subject", "message_body as body", "message_date as date", "message_read as read").where({
            'id': messageId,
        }).limit(1);
        return message[0];
    }
    async markAsRead(userIdTo, messageId) {
        await this.knex("user_messages").update({
            'message_read': Notifications.read.true,
        }).where({ 'id': messageId, 'userid_to': userIdTo });
    }
    async countUnreadMessages(userIdTo) {
        const messages = await this.knex("user_messages").count("id as Total").where({
            'userid_to': userIdTo,
            'message_read': Notifications.read.false,
        }).orderBy('id', 'desc').limit(99);
        return messages[0]["Total"];
    }
    async createMessage(userIdTo, userIdFrom, subject, body) {
        await this.knex('user_messages').insert({
            'userid_to': userIdTo,
            'userid_from': userIdFrom,
            'message_subject': subject,
            'message_body': body,
            'message_date': this.moment().format('YYYY-MM-DD HH:mm:ss'),
            'message_read': Notifications.read.false,
        });
    }
}
exports.default = NotificationsDAL;

