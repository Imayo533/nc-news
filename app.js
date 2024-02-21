const express = require("express")
const app = express()
const {getTopics, getApi, getArticleById} = require("./controller")
app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api", getApi)

app.get("/api/articles/:article_id", getArticleById)

app.all("/api/*", (request, response, next)=>{
    response.status(404).send({msg:"Not found!"})
    next()
})

app.use((err, request, response, next)=>{
    if(err){
    response.status(400).send({msg: "Bad request"})
    }
})

app.use((err, request, response, next)=>{
    if(err){
    response.status(500).send({msg: "Internal server error!"})
    }
})

module.exports = app