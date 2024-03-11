const { allTopics, getApi, selectArticleById, arrayOfArticles, arrCommentsByArtId, addComment, updateArticleVote, deleteCommentById} = require("./model");
const endPoints = require("./endpoints.json");
const { response } = require("./app");

exports.getTopics = (request, response, next) => {
  allTopics()
    .then((topics) => {
    
      response.status(200).send({ topics });
    })
    .catch((err) => {
        
      next(err);
    });
};

exports.getApi = (request, response, next) => {
  response.status(200).send({endPoints})
};

exports.getArticleById = (request, response, next) => {
    const {article_id} = request.params
    
    selectArticleById(article_id).then((article)=>{
        response.status(200).send({article})
    })
    .catch((err)=>{
        next(err)
    })
}
exports.getArrOfArticles = (request, response, next) => {

    arrayOfArticles().then((articles)=>{
        response.status(200).send(articles)
    })
    .catch((err)=>{
        next(err)
    })
}
exports.getCommentsByArtId = (request, response, next) => {
    const {article_id} = request.params
    arrCommentsByArtId(article_id).then((array)=>{
        response.status(200).send(array)
    })
    .catch((err)=>{
        next(err)
    })
}
exports.postComment = (request, response, next) => {
    
    const article_id = request.params.article_id
    selectArticleById(article_id)
        
    .then(()=>{
        addComment(article_id, request.body)
       
        .then((result)=>{
         
            response.status(201).send(result)
        })
        .catch((err)=>{  
            next(err)
        })
    })
    .catch((err)=>{
        next(err)
    })
}
exports.patchVote = (request, response, next) => {
    const {article_id} = request.params
    const {inc_votes} = request.body

   
    updateArticleVote(article_id, inc_votes)
    .then((updatedArticle)=>{
        response.status(200).send({updatedArticle})
    })
    .catch((err)=>{
        next(err)
    })
}
exports.deleteComment = (request, response, next) => {
    const {comment_id} = request.params
    deleteCommentById(comment_id)
    .then(()=>{
        response.sendStatus(204)
    })
    .catch((err)=>{
        console.log(err, "err from controller<<<<<<<<<<")
    })
}