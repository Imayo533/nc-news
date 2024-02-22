const express = require("express")
const app = express()
const {getTopics, getApi, getArticleById, getArrOfArticles, getCommentsByArtId} = require("./controller")

app.get("/api/topics", getTopics)

app.get("/api", getApi)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArrOfArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArtId)

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