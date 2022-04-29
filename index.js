const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// username: Rasel 
// pass: lIP6xROjO2R2e3tk

app.get('/', (req, res) => {
    res.send("Running Inventory server");
})

app.listen(port, () => {
    console.log("Listening to port", port);
})



// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://Rasel:<password>@cluster0.lcyo8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
