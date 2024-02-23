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
            return []
        }
        return result.rows
    })  
}

