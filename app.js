const express = require("express");
const app = express();
const engine = require("ejs-mate");
const path = require("path");
const db = require("./db.js");
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.listen(4000, () => {
  console.log("Server running on port 4000");
});

app.get("/", (req, res) => {
  // const Phone = "SELECT * FROM device";
  // db.query(Phone,(error,result)=>{
  //   console.log(result);
  // });
  const query = "SELECT * FROM sos";
  db.query(query, (error, results) => {
    if (error) {
      return res.send("Error Occured!"); // Pass the error to the callback
    }
    // console.log(results);  
    res.render("pages/Home.ejs", { SOS: results });
  });
});

app.get("/api/sos/:id", (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      sos.id as sos_id, 
      loc_last.latitude as last_latitude, 
      loc_last.longitude as last_longitude, 
      device.phone, 
      device.id as device_id,
      loc_all.latitude as all_latitude, 
      loc_all.longitude as all_longitude
    FROM sos 
    INNER JOIN location loc_last ON sos.last_location_id = loc_last.id 
    INNER JOIN device ON sos.device_id = device.id 
    INNER JOIN location loc_all ON loc_all.device_id = device.id 
    WHERE sos.id = ? AND sos.is_done = false;
  `;

  db.query(query, [id], (error, results) => {
    if (error) {
      return res.send("Error Occurred!");
    }
    if (results.length > 0) {
      console.log(results);
      // Construct the SOS object
      let sos = {
        id: results[0].sos_id,
        last_location: {
          latitude: results[0].last_latitude,
          longitude: results[0].last_longitude,
        },
        locations: results.map((loc) => ({
          latitude: loc.all_latitude,
          longitude: loc.all_longitude,
        })),
        phone: results[0].phone,
        device_id: results[0].device_id,
      };
      res.json({ sos });
    } else {
      res.send("No active SOS found!");
    }
  });
});
app.get("/sos/:id", (req, res) => {
  res.render("pages/SOS.ejs", { id: req.params.id });
});

////////////////////////////


const bodyParser = require("body-parser");

app.use(bodyParser.json()); // Parse JSON data

// Route to handle incoming GPS coordinates
app.post("/send-coordinates", (req, res) => {
  const { device_id, latitude, longitude } = req.body;

  if (!device_id || !latitude || !longitude) {
    return res.status(400).send("Invalid data. All fields are required.");
  } 

  const query = `INSERT INTO location (device_id, latitude, longitude) VALUES (?, ?, ?)`;
  db.query(query, [device_id, latitude, longitude], (err, result) => {
    if (err) {
      console.error("Error inserting coordinates:", err);
      return res.status(500).send("Failed to insert data into the database.");
    }
    res.send("Coordinates successfully saved to the database.");
  });
});

