const express= require("express");
const app= express();
const bodyParser = require("body-parser");
const https = require("https");
app.use(bodyParser.urlencoded({extended:true}));
const dotenv = require("dotenv");
const result = dotenv.config()
    
app.use(express.static(__dirname + '/'));
app.get("/", function(req,res)
{
    res.sendFile(__dirname + "/index.html")
});

app.post("/",function(req,res)
{
    const query=req.body.cityName; 
    const apiKey= result.parsed;
    const unit="metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
    https.get(url, function(response)
    {
        console.log(response.statusCode);

        response.on("data",function(data)
        {
            const weatherData = JSON.parse(data)
           
            const temp = weatherData.main.temp;
            const pressure = weatherData.main.pressure;
            const humidity = weatherData.main.humidity;
            
            const description = weatherData.weather[0].description;
            
            const icon = weatherData.weather[0].icon;
            
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"

            res.write("<p> The weather is currently " + description + "<p>");
            res.write("<h1> The temperature in " + query + " is " + temp + "℃" );
            res.write("<h2> The pressure is" + pressure );
            res.write("<h2> The humidity is" + humidity );
            res.write("<img src=" + imageURL + ">");
            res.send();
        });
    });
    
})


app.listen(3000, function()
{
    console.log("Server started on port 3000.")
})
