const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//dataBase

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tjc9clz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client
      .db("photography")
      .collection("photoService");
    const reviewCollection = client.db("photography").collection("review");
    app.get("/service", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const result = await cursor.limit(3).toArray();
      res.send(result);
    });

    app.get("/allService", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/allService/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    app.post("/feedback", async (req, res) => {
      const user = req.body;
      // console.log(user)
      const result = await reviewCollection.insertOne(user);
      console.log(result);
      res.send(result);
    });

    app.get("/feedback", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/feedback', async(req, res)=>{
        const query = {}
        const cursor = reviewCollection.find(query)
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get("/feedback/:id", async (req, res) => {
      const id = req.params.id;
      const query = { service: id };
      const result = reviewCollection.find(query);
      const cursor = await result.toArray();

      res.send(cursor);
    });

    app.delete("/feedback/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });

    app.post('/addService', async(req, res)=>{
        const service = req.body;
        const result = await serviceCollection.insertOne(service);
    //   console.log(result);
      res.send(result);

    })



  } catch (error) {
    console.log(error.name, error.message);
  }
}
run().catch((error) => {
  console.log(error);
});

//routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
