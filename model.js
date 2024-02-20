const db = require('./db/connection.js')
const fs = require("fs/promises")

exports.allTopics = () => {
    let arrayOfTopics = `SELECT * FROM topics`
    return db.query(arrayOfTopics).then((result)=>{
        return result.rows
    })
}


