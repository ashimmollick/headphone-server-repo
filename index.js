const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ue2o2me.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const catogoryOptionCollection = client.db('headphone').collection('catagory');
        const catogoryProductsCollection = client.db('headphone').collection('catagoriesLIst');



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







    }
    finally {

    }
}
run().catch(console.log);

app.get('/', async (req, res) => {
    res.send('headphone server is running');
})

app.listen(port, () => console.log(`Headphone server running on ${port}`))