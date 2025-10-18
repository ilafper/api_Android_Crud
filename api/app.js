const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
app.use(express.json());

const uri = "mongodb+srv://ialfper:ialfper21@alumnos.zoinj.mongodb.net/alumnos?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

async function connectToMongoDB() {
  try {
    if (!client.isConnected()) await client.connect();
    const db = client.db('UsuariosAndroid');
    return { usuarios: db.collection('usuarios') };
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    throw error;
  }
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/api/usuarios', async (req, res) => {
  try {
    const { usuarios } = await connectToMongoDB();
    const lista = await usuarios.find().toArray();
    res.json(lista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los especialistas' });
  }
});

app.post('/api/crear', async (req, res) => {
  try {
    const { nombre, rango, region, via } = req.body;

    if (!nombre || !rango || !region || !via) {
      return res.status(400).json({ error: 'Faltan campos obligatorios...' });
    }

    const { usuarios } = await connectToMongoDB();

    const nuevaTarjeta = {
      nombre,
      rango,
      region,
      via_principal: via
    };

    const resultado = await usuarios.insertOne(nuevaTarjeta);

    console.log(`Tarjeta creada con ID: ${resultado.insertedId}`);

    res.status(201).json({
      mensaje: 'Tarjeta creada y guardada con éxito',
      id: resultado.insertedId,
      tarjeta: nuevaTarjeta
    });

  } catch (error) {
    console.error("Error al guardar la tarjeta en MongoDB:", error);
    res.status(500).json({ error: 'Error interno del servidor al crear la tarjeta', detalle: error.message });
  }
});

module.exports = app;
