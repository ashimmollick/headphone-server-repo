const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000



// middleware
const app = express()

app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ue2o2me.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const catogoryOptionCollection = client.db('headphone').collection('catagory');
        const catogoryProductsCollection = client.db('headphone').collection('catagoriesLIst');
        const orderBookingCollection = client.db('headphone').collection('orders');
        const usersCollection = client.db('headphone').collection('users');



        app.get('/catagory', async (req, res) => {

            const query = {};
            const options = await catogoryOptionCollection.find(query).toArray();
            res.send(options);
        });
        app.get('/catagoryss/:id', async (req, res) => {

            const id = req.params.id;
            const query = {
                catagory_id: id
            };
            const options = await catogoryProductsCollection.find(query).toArray()
            res.send(options);
        });
        app.get('/order/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = await catogoryProductsCollection.findOne(query)
            res.send(options);
        });
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const { query } = { email: email }
            const orders = await orderBookingCollection.find(query).toArray()
            res.send(orders)
        });
        app.put('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderBookingCollection.insertOne(order)
            res.send(result)

        });
        app.post('/users', async (req, res) => {
            const user = req.body;

            const result = await usersCollection.insertOne(user)
            res.send(result)
        })






    }
    finally {

    }
}
run().catch(console.log);

app.get('/', async (req, res) => {
    res.send('headphone server is running');
})

app.listen(port, () => console.log(`Headphone server running on ${port}`))