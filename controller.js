const { allTopics, getApi} = require("./model");
const endPoints = require("./endpoints.json")

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
    console.log(response)
  response.status(200).send({endPoints})
};
