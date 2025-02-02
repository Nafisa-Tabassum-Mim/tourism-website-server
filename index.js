const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gnbvncz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const tourismCollection = client.db('tourismDB').collection('tourism');

        app.post('/tourism', async (req, res) => {
            const newTourism = req.body;
            console.log(newTourism);
            const result = await tourismCollection.insertOne(newTourism);
            res.send(result);
        })


        app.get('/tourism', async (req, res) => {
            const cursor = tourismCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/mylist/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await tourismCollection.findOne(query);
            res.send(result);
        })

        app.delete('/mylist/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await tourismCollection.deleteOne(query);
            res.send(result);
        })


        app.put('/mylist/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedTourism = req.body;

            const tourism = {
                $set: {
                    photo: updatedTourism.photo,
                    photo: updatedTourism.value,
                    tourismName: updatedTourism.tourismName,
                    countryName: updatedTourism.countryName,
                    location: updatedTourism.location,
                    shortDescription: updatedTourism.shortDescription,
                    averageCost: updatedTourism.averageCost,
                    seasonality: updatedTourism.seasonality,
                    travelTime: updatedTourism.travelTime,
                    totalVisitorsPerYear: updatedTourism.totalVisitorsPerYear,
                    email: updatedTourism.email,
                    name: updatedTourism.name,
                }
            }

            const result = await tourismCollection.updateOne(filter, tourism, options);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Toursim server is working')
})

app.listen(port, () => {
    console.log(`tourism server is running on port ${port}`)
})