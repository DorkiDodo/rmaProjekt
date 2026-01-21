const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "ucka.veleri.hr",
    user: "dsepic",
    password: "11",
    port: 3306,
    database: "dsepic",
  });

app.use(express.urlencoded({ extended: true }));
  
db.connect(function(err) {
    if (err) {
        console.error("MySQL connection error:", err);
        return;
    }
    console.log("Connected to MySQL!");
});

app.get("/api/troskovi", (req, res) => {
  db.query("SELECT * FROM troskovi", (error, results) => {
    if (error) {
      console.error("Greška pri dohvaćanju:", error);
      return res.status(500).send("Greška na serveru");
    }
    res.send(results);
  });
});



app.post("/api/unostroskova", (request, response) => {
  const { nazivTroska, vrijednost, datum, opis } = request.body;
  const query = "INSERT INTO troskovi (nazivTroska, vrijednost, datum, opis) VALUES (?, ?, ?, ?)";
  
  connection.query(query, [nazivTroska, vrijednost, datum, opis], (error, results) => {
    if (error) {
      return response.status(500).send(error);
    }
    response.send(results);
  });
});

app.listen(port, () => {
    console.log("Server running at port: " + port);
});