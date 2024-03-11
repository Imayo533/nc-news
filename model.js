const db = require('./db/connection.js')
const fs = require("fs/promises")

exports.allTopics = () => {
    let arrayOfTopics = `SELECT * FROM topics`
    return db.query(arrayOfTopics).then((result)=>{
     
        return result.rows
    })
}
exports.selectArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({rows})=>{
        if(!rows[0]){
            return Promise.reject({status: 404, msg:"Not found"})
        }
        return rows[0]
    })
}
exports.arrayOfArticles = () => {
   return db.query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.*)::int AS comment_count FROM articles JOIN comments ON comments.article_id=articles.article_id GROUP BY articles.article_id ORDER BY created_at DESC;`)
   .then((result)=>{
    return result.rows
   })
}
exports.arrCommentsByArtId = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [article_id])
    .then((result)=>{  
    
        if(result.rows.length===0){
            return Promise.reject({status:404, msg:"Not found!"})
        }

        return result.rows
    })  
}
exports.addComment = (article_id, newComment) =>{
    
const { username, body} = newComment

if(!username || !body){
  
    return Promise.reject({status: 400, msg: "Bad request"})
}
    return db.query(
        `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`, [newComment.username, newComment.body, article_id]
    )
    .then((result) => {      
        return result.rows[0]
    })
    
}   
exports.updateArticleVote = (article_id, inc_votes) =>{
    return db.query(
        `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [inc_votes, article_id] 
    )
    .then((result)=>{
        if(result.rows.length===0){
            return Promise.reject({status:404, msg:"Not found!"})
        }
        return result.rows[0]
    })
}
exports.deleteCommentById = (comment_id) => {
   return db.query(
    `DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment_id]
   )
//    .then((result)=>{
//     console.log(result,"<<<<result from model")
//     return result.rows[0]
//    })
}


