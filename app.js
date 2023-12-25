const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const ejs = require('ejs');
const methodOverride = require('method-override');

const app = express();
const port = 3000;
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'crud-app';

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

client.connect()
  .then(() => {
    console.log('Berhasil terhubung ke server MongoDB');
  })
  .catch(err => {
    console.error('Error koneksi ke MongoDB:', err);
  });

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/items', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('Item');
    const items = await collection.find({}).toArray();
    res.render('index', { items });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Kesalahan Internal Server' });
  }
});

app.post('/items', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('Item');
    const result = await collection.insertOne({ name: req.body.name });
    res.redirect('/items');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Kesalahan Internal Server' });
  }
});

app.post('/delete/items/:name', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('Item');
    // const itemId = new ObjectID(req.params.id);  
    const result = await collection.deleteOne({ name: req.params.name
     });
    if (result.deletedCount === 1) {
      res.redirect('/items');
    } else {
      res.status(404).json({ error: 'Item tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Kesalahan Internal Server' });
  }
});

app.post('/update/items/:name', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('Item');
    // const itemId = ObjectID(req.params.name);
    const result = await collection.updateOne({ name: req.params.name }, { $set: { name: req.body.name } });
    if (result.modifiedCount === 1) {
      res.redirect('/items');
    } else {
      res.status(404).json({ error: 'Item tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Kesalahan Internal Server' });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
