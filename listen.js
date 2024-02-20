const app = require("./app")

app.listen(9090, (error)=>{
    if(error) console.log(error)
    else console.log("Listening on port 9090")
   
})