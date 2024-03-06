const express = require("express")
const app = express()
const {getTopics, getApi, getArticleById, getArrOfArticles, getCommentsByArtId, postComment, patchVote} = require("./controller")
app.use(express.json());

app.get("/api/topics", getTopics)

app.get("/api", getApi)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles", getArrOfArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArtId)

app.post("/api/articles/:article_id/comments", postComment)

app.patch("/api/articles/:article_id", patchVote)

app.use((err, request, response, next)=>{

    if(err.status && err.msg){
               
    response.status(err.status).send({msg: err.msg})
    }
    else if(err.code === '22P02' || err.code === '23502'){
        
        response.status(400).send({msg: "Bad request"})
    }
    next()
})

app.all("/api/*", (request, response, next)=>{
    response.status(404).send({msg:"Not found!"})
    next()
})

app.use((err, request, response, next)=>{
    if(err){
        
    response.status(400).send({msg: "Bad request"})
    }
    next()
})

app.use((err, request, response, next)=>{
    if(err){
        
    response.status(500).send({msg: "Internal server error!"})
    }
})

module.exports = app