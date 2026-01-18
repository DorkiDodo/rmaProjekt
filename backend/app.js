const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: "ucka.veleri.hr",
    user: "dsepic",
    password: "11",
    port: 3306,
    database: "dsepic",
  });

app.use(express.urlencoded({ extended: true }));
  
connection.connect(function(err) {
    if (err) {
        console.error("MySQL connection error:", err);
        return;
    }
    console.log("Connected to MySQL!");
});

app.get("/api/troskovi", (req, res) => {
  connection.query("SELECT * FROM troskovi", (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});



app.post("/api/unostroskova", (request, response) => {
  const data = request.body;
  trosak = [[data.nazivTroska, data.vrijednost, data.datum, data.opis]];
  connection.query("INSERT INTO troskovi (nazivTroska, vrijednost, datum, opis) VALUES ?", [trosak], (error, results) => {
    if (error) throw error;
    response.send(results);
  });
});

app.listen(port, () => {
    console.log("Server running at port: " + port);
});