const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())


//dataBase


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tjc9clz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

    try{
        const serviceCollection = client.db('photography').collection('photoService')
        app.get('/service', async(req, res)=>{
            const query = {}
            const cursor = serviceCollection.find(query)
            const result = await cursor.limit(3).toArray()
            res.send(result)
        })

        app.get('/allService', async(req, res)=>{
            const query = {}
            const cursor = serviceCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })


    }
    catch(error){
        console.log(error.name, error.message)
        
    }

}
run().catch(error =>{
    console.log(error)
    
})





//routes
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`)
})