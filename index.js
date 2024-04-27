const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@another.giaqna9.mongodb.net/?retryWrites=true&w=majority&appName=another`;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

console.log(process.env.DB_PASS, process.env.DB_USER);

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    const coffeeCollection = client.db("userDB").collection("coffee");
    app.get("/add/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
      console.log(result);
    });
    app.get("/add", async (req, res) => {
      const query = {};
      const options = {
        projection: { foodName: 1, chefName: 1, price: 1, photo: 1 },
      };
      const cursor = coffeeCollection.find(query, options);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/add", async (req, res) => {
      const coffeeInfo = req.body;

      const result = await coffeeCollection.insertOne(coffeeInfo);
      res.send(result);
    });

    app.put("/add/:id", async (req, res) => {
      const id = req.params.id;
      const coffee = req.body;
      const updateDoc = {
        $set: {
          foodName: coffee.foodName,
          chefName: coffee.chefName,
          supplier: coffee.supplier,
          price: coffee.price,
          category: coffee.category,
          details: coffee.details,
          photo: coffee.photo,
        },
      };
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const result = await coffeeCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
    });
    app.delete("/add/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      // res.send({ _id: id });
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send({ ...result, _id: id });
    });

    console.log(
      `Pinged your deployment. You successfully connected to MongoDB! at ${port}`
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Ok, eat coffe now.");
});

app.listen(port, () => {
  console.log(`Coffee making...||| ${port}`);
});

// hotCoffee
// DT3ManF1w30YwUoo
