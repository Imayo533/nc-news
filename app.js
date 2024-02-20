const express = require("express")
const app = express()
const {getTopics} = require("./controller")

app.get("/api/topics", getTopics)

app.all("/api/*", (request, response, next)=>{
    response.status(404).send({msg:"Not found!"})
    next()
})

app.use((err, request, response, next)=>{
    if(err){
    response.status(500).send({msg: "Internal server error!"})
    }
})

module.exports = app