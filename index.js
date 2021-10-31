const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1wmci.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('tour-mate-db');
        const serviceCollection = database.collection('services');
        const hotelCollection = database.collection('hotels');
        const reviewCollection = database.collection('reviews');
        const myOrdersCollection = database.collection('myOrders');
        const manageOrdersCollecton = database.collection('manageOrders');
        // console.log('database connect successfully');

        //GET services api
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //GET single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific id', id);
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
        });
        //GET myOrder api
        app.get('/myOrders', async (req, res) => {
            const cursor = myOrdersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        //GET hotels api
        app.get('/hotels', async (req, res) => {
            const cursor = hotelCollection.find({});
            const hotels = await cursor.toArray();
            res.send(hotels);
        });
        //GET reviews api
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
        //POST service api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });
        //POST myOrders
        app.post('/myOrders', async (req, res) => {
            const order = req.body;
            console.log('hit the post api', order);
            const result = await myOrdersCollection.insertOne(order);
            // console.log(result);
            res.json(result);
        });

        //Delete API
        app.delete('/myOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await myOrdersCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
    res.send('tour mate server is running');
});

app.listen(port, () => {
    console.log('server is running at port', port);
});