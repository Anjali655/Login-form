const http = require("http");
const fs = require("fs");
const host = "localhost";
const port = 3000;
var {MongoClient} = require("mongodb");
var url = "mongodb://localhost:27017/taskdb";

const requestListener = function (req, res) {
  // console.log(req.url, req.method, "req");

  const GETheaders = {
    "Access-Control-Allow-Origin": "http://localhost:8000",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Content-Type": "text/html",
  };
  const POSTheaders = {
    "Access-Control-Allow-Origin": "http://localhost:8000",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Content-Type": "text/json",
  };

  if (req.method === "GET") {
    res.writeHead(200, GETheaders);
    fs.createReadStream("index.html", "UTF-8").pipe(res);
  } else if (req.method === "POST") {
    let jsonString;
    req.on("data", (data) => {
      jsonString = JSON.parse(data);
    });

    req.on("end", () => {
      console.log(JSON.stringify(jsonString));
    

      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("taskdb");
        var user = jsonString
        dbo.collection("customers").insertOne(user, function(err, result){
          if(err) throw err;
          console.log("1 record inserted!");
          db.close();
        })
      });


      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.setHeader("Access-Control-Allow-Credentials", true);
      res.writeHead(200, POSTheaders);
      res.write(JSON.stringify(jsonString), () => {
        res.end();
      });
    });
  }
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
