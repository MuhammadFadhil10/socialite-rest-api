import db from "../database/db.js";
export default class Like{
    static addLike(myId,myUserName,postId) {
        return db.execute(`INSERT INTO likes(user_id,user_name,post_id) VALUES(?,?,?)`,[myId,myUserName,postId])
    }

    static findExistingLike(myId,postId) {
        return db.execute(`SELECT * FROM likes WHERE user_id = ${myId} AND post_id = ${postId}`)
    }

    static unLiked(myId, postId) {
        return db.execute(`Delete FROM likes WHERE user_id = ${myId} AND post_id = ${postId}`)
    }

    static getPostLike() {
        return db.execute(`SELECT * FROM likes`)
    }
}