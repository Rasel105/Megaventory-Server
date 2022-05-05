const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// function verifyJWT(req, res, next) {
//     const authHeader = req.headers.authorization;
//     console.log(authHeader);
//     if (!authHeader) {
//         return res.status(401).send({ message: "Unauthorized" });
//     }
//     const token = authHeader.split(' ')[1];
//     // console.log(token);
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(403).send({ message: "Forbidden" });
//         }
//         console.log("Decoded", decoded);
//         req.decoded = decoded;
//         next();
//     });

// }

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcyo8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const inventoryCollenction = client.db("FridgeInventory").collection("products");
        const delearCollenction = client.db("FridgeInventory").collection("dealers");
        const transactionsCollenction = client.db("FridgeInventory").collection("recentTransactions");
        const blogsCollenction = client.db("FridgeInventory").collection("blogs");

        // // AUTHENTICATOIN WITH JWT 
        // app.post('/login', async (req, res) => {
        //     const user = req.body;
        //     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        //         expiresIn: '1d'
        //     });
        //     res.send({ accessToken });
        // })


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
            // const decodedEmail = req.decoded.email;
            const email = req.query.email;
            const query = { email: email };
            const cursor = inventoryCollenction.find(query);
            const items = await cursor.toArray();
            res.send(items);

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

        // POST API FOR BLOGS

        app.post('/blog', async (req, res) => {
            const newBlog = req.body;
            const result = await blogsCollenction.insertOne(newBlog);
            res.send(result);
        })

        // GET API FOR BLOGS 

        app.get('/blogs', async (req, res) => {
            const query = {};
            const cursor = blogsCollenction.find(query);
            const blogs = await cursor.toArray();
            res.send(blogs);
        })

    }
    finally {

    }
};

run().catch(console.dir)
app.get('/', (req, res) => {
    res.send("Running Inventory server");
});

app.get("/hero", (req, res) => {
    res.send('HeroKu');
})

app.listen(port, () => {
    console.log("Listening to port", port);
});




