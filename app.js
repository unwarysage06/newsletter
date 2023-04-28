const express = require('express');
const bodyParser = require('body-parser')
const requist = require('request');
const app = express()
const https = require("https");
const { json } = require('express/lib/response');




app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }))


app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html")
})
app.get("/success",function(req,res){
    res.sendFile(__dirname + "/success.html")
})

app.get("/failure",function(req,res){
    res.sendFile(__dirname + "/failure.html")
})

app.post("/",function(req,res){
    var f_name = req.body.first;
    var l_name = req.body.last;
    var email_add = req.body.email;
    console.log("first name " + f_name + " last name " + l_name + " email " + email_add);
    const url = 'https://us14.api.mailchimp.com/3.0/lists/149ebcd837/members';
    const apiKey = '8cce8ab7af3ed19931e238d1ed7823ea-us14';
    const data = JSON.stringify({
      email_address: email_add,
      status: 'subscribed',
      merge_fields : {
          FNAME : f_name,
          LNAME : l_name
      }
    });
    
    // Prepare the request options
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    };
    
    const httpRequest = https.request(url,options,function(response){
        response.on("data",function(d){
            console.log(JSON.parse(d));
            if(response.statusCode  == 200){
                res.redirect("/success")
            }else{
                res.redirect("/failure")

            }
        })
    })    
    httpRequest.write(data);
    httpRequest.end(); 
    
})

app.post("/failure",function(req,res){
    res.redirect("/")
})
// Start the server on port 3000
app.listen(3000,function(){
    console.log("Running on port 3000.")
})


//APi Key
//8cce8ab7af3ed19931e238d1ed7823ea-us14


//list id
//149ebcd837