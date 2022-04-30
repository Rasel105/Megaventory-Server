const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// username: Rasel 
// pass: lIP6xROjO2R2e3tk

const uri = "mongodb+srv://Rasel:lIP6xROjO2R2e3tk@cluster0.lcyo8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const inventoryCollenction = client.db("FridgeInventory").collection("products");

        // GET API 
        // http://localhost:5000/products
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = inventoryCollenction.find(query);
            const products = await cursor.toArray({});
            res.send(products);
        });

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await inventoryCollenction.findOne(query);
            res.send(result);
        })

        // descresing quantity from  
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: data.quantity - 1,
                },
            };
            const result = await inventoryCollenction.updateOne(filter, updateDoc, options);
            res.send(result);
        })


    }
    finally {

    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send("Running Inventory server");
})

app.listen(port, () => {
    console.log("Listening to port", port);
})




