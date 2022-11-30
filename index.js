const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000



// middleware
const app = express()

app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ue2o2me.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJwt(req, res, next) {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Unauthroze access')
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })
}
async function run() {
    try {
        const catogoryOptionCollection = client.db('headphone').collection('catagory');
        const catogoryProductsCollection = client.db('headphone').collection('catagoriesLIst');
        const orderBookingCollection = client.db('headphone').collection('orders');
        const usersCollection = client.db('headphone').collection('users');


        const verifyAdmin = async (req, res, next) => {
            const decodedEmail = req.decoded.email;
            const query = { email: decodedEmail };
            const user = await usersCollection.findOne(query);

            if (user?.role !== 'admin') {
                return res.status(403).send({ message: 'forbidden access' })
            }
            next();
        }
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
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
                return res.send({ accesToken: token })
            }

            res.status(403).send({ accesToken: '' })
        });
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query)
            res.send({ isAdmin: user?.role === 'admin' });
        })
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query)
            res.send({ isSeller: user?.role === 'Seller' });
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result)
        });
        app.get('/users', async (req, res) => {
            const query = {}
            const users = await usersCollection.find(query).toArray();
            res.send(users)
        });
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
        })
        app.delete('/sellers/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = await usersCollection.deleteOne(filter);
            res.send({ isSeller: user?.role === 'admin' });
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