const { allTopics, getApi, selectArticleById} = require("./model");
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