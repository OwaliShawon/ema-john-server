const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://emaWatson:${process.env.DB_PASS}@cluster0.po0nn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());
const port = 5000;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");
    const ordersCollection = client.db("emaJohnStore").collection("orders");

    app.post("/addProduct", (req, res) => {
        const products = req.body;
        console.log(products);
        productsCollection.insertOne(products)
            .then(result => {
                console.log(result);
                // res.send(result.insertedCount);
            })
    })

    app.get("/products", (req, res) => {
        productsCollection.find({}).limit(20)
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get("/product/:key", (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/productsByKeys', (req, res) => {
        const ProductKeys = req.body;
        // console.log(ProductKeys);
        productsCollection.find({ key: { $in: ProductKeys } })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post("/addOrder", (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount);
            })
    })



});


app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})