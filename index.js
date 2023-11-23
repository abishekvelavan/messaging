const e = require('express');
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = 3000; // You can change the port as needed

const uri = "mongodb+srv://Myself:zyC3RtC2F3UMavcb@cluster0.m3yk5jk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    poolSize: 10,
  }
});

app.use(express.json());

app.post('/api/messages', async (req, res) => {
  try {
    await client.connect();

    const db = client.db('Messages');
    const collection = db.collection('message_list');

    const { phone_number, message, author } = req.body;

    // Check if the phone number already exists
    const existingDocument = await collection.findOne({ phone_number });

    if (existingDocument) {
      // Phone number exists, update the existing document
      const currentEntity = existingDocument.messages[existingDocument.messages.length -1].entity
      if (author !== 'bot') {
        if (currentEntity == 'new') {
            existingDocument.messages.push({ message, timeStamp: timestamp, author });
            existingDocument.entity = 'driverDetails';
          } else if (currentEntity == 'driverDetails') {
            existingDocument.messages.push({ message, timeStamp: timestamp, author });
            //existingDocument.action = 'clu';
          } else if (existingDocument.entity !== 'getTrailerDetails') {
            existingDocument.messages.push({ message, timeStamp: timestamp, author });
            existingDocument.entity = 'getDockDoor';
        }
      } else {
            existingDocument.messages.push({ message, timeStamp: timestamp, author:'bot' });
      } 
      await collection.updateOne({ phone_number }, { $set: existingDocument });
    } else {
      // Phone number doesn't exist, create a new document
      const newDocument = {
        phone_number,
        name: '',
        created_at: new Date(),
        messages: [{ message, author}],
        action: null,
        entity:  'new'
      };

      await collection.insertOne(newDocument);
    }
    const response = await collection.findOne({ phone_number }, { $set: existingDocument });
    console.log(response);
    res.status(200).json({ message: 'Operation successful', response });
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
