const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
app.use(express.json());

// Configura la conexión a MongoDB
const uri = "mongodb+srv://ialfper:ialfper21@alumnos.zoinj.mongodb.net/alumnos?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Función para conectar a la base de datos y obtener las colecciones
async function connectToMongoDB() {
  try {
    client.connect();
    console.log("Conectado a MongoDB Atlas");
    const db = client.db('UsuariosAndroid');
    return {
      
      usuarios: db.collection('usuarios'),
      
    };
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    throw new Error('Error al conectar a la base de datos');
  }
}



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

//endpoint para obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
  try {
    const { usuarios } = await connectToMongoDB();
    const lista = await usuarios.find().toArray();
    console.log(lista);
    
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los especialistas' });
    console.log("nonononon");
  }
});



app.post('/api/crear', async (req, res) => {
// ... (Destructuring y validación de req.body) ...
    const { nombre, rango, region, via_principal } = req.body; 

    if (!nombre || !rango || !region || !via_principal) {
        return res.status(400).json({ error: 'Faltan campos obligatorios...' });
    }

    const nuevaTarjeta = {
        nombre: nombre,
        rango: rango,
        region: region,
        via_principal: via_principal,
    };

    try {
        const { usuarios } = await connectToMongoDB();
        
        // 1. Insertar el documento
        const resultado = await usuarios.insertOne(nuevaTarjeta);

        
        console.log(`Tarjeta creada con ID: ${resultado.insertedId}`);
        
        res.status(201).json({ // <-- Esto finaliza la petición HTTP
            mensaje: 'Tarjeta creada y guardada con éxito',
            id: resultado.insertedId,
            tarjeta: nuevaTarjeta 
        });

    } catch (error) {
        // Manejo de errores 
        console.error("Error al guardar la tarjeta en MongoDB:", error);
        res.status(500).json({ error: 'Error interno del servidor al crear la tarjeta' });
    }

});



module.exports = app;