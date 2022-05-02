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
        const delearCollenction = client.db("FridgeInventory").collection("dealers");
        const transactionsCollenction = client.db("FridgeInventory").collection("recentTransactions");

        // GET API 
        // http://localhost:5000/products
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = inventoryCollenction.find(query);
            const products = await cursor.toArray({});
            res.send(products);
        });

        // get API For leaders
        app.get('/dealers', async (req, res) => {
            const query = {};
            const cursor = delearCollenction.find(query);
            const dealers = await cursor.toArray({});
            res.send(dealers);
        });

        // recent Transaction API 
        app.get('/transactions', async (req, res) => {
            const query = {};
            const cursor = transactionsCollenction.find(query);
            const transactions = await cursor.toArray({});
            res.send(transactions);
        });

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await inventoryCollenction.findOne(query);
            res.send(result);
        });

        // GET API FOR THE MY ITEM PAGE 
        app.get('/myitems', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = inventoryCollenction.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });
        // my item delete api 
        app.delete('/myitem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await inventoryCollenction.deleteOne(query);
            res.send(result);
        });

        // descresing quantity from  inventroy page
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: data.quantity - 1,
                    sold: parseInt(data.sold) + 1,
                },
            };
            const result = await inventoryCollenction.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        // Add product API 
        app.post("/product", async (req, res) => {
            const newPruduct = req.body;
            const result = await inventoryCollenction.insertOne(newPruduct);
            res.send(result);
        });

        // insert product api   
        app.put('/insertProduct/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    // quantity: parseFloat(...data.quantity + data.quantity),
                    quantity: data.quantity
                },
            };
            const result = await inventoryCollenction.updateOne(filter, updateDoc, options);
            res.send(result);
        });

        // DELETE API,
        // DELETE FROM MANAGE INVENTORY PAGE 
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await inventoryCollenction.deleteOne(query);
            res.send(result);
        });

    }
    finally {

    }
};

run().catch(console.dir)
app.get('/', (req, res) => {
    res.send("Running Inventory server");
});

app.listen(port, () => {
    console.log("Listening to port", port);
});




