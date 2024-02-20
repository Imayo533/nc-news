const {allTopics} = require("./model")

exports.getTopics = (request, response, next) => {
    allTopics().then((topics)=>{
        response.status(200).send({topics})
    }).catch((err)=>{
        next(err)
    })
  };

 