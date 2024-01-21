require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  console.log(req.url)
  res.sendFile(process.cwd() + "/views/index.html");
});


let url;
let urlList = [];
let shortUrlList = [];

app.post("/api/shorturl", (req, res) => {
    url = req.body.url
    const indexme = urlList.indexOf(url)

    if (!url.includes("https://") && !url.includes("http://")) {
      res.json({ error: "invalid url"}); 
    }

  
    if ( indexme < 0) {
      urlList.push(url)
      shortUrlList.push(urlList.length)
      
      return res.json({ original_url: url, short_url: shortUrlList.length })
    }

  res.json( { 
    original_url: url, 
    short_url: shortUrlList[indexme]
  })
  

});

app.get("/api/shorturl", function (req, res) {
  res.send("Not Found");
});

app.get("/api/shorturl/:short_url", (req, res) => {
  let short_Url = parseInt(req.params.short_url);
  let index = shortUrlList.indexOf(short_Url);

  if (index < 0){
    return res.json( { error: "No valid url input" } )
  }
  res.redirect(urlList[index]); 
  
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
