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

