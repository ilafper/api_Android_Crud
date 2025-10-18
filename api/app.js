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



//endpoint para crear personaje
app.post('/api/creartargeta', async (req, res) => {
    // Los datos de la tarjeta vienen en el cuerpo de la petición (req.body)
    const { nombre, rango, region, via } = req.body; 

    // Opcional: Validación básica de los datos
    if (!nombre || !rango || !region || !via) {
        return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, rango, region, o via.' });
    }

    // Objeto que se insertará en MongoDB
    const nuevaTarjeta = {
        nombre: nombre,
        rango: rango,
        region: region,
        via_principal: via,
    };

    try {
        const { usuarios } = await connectToMongoDB();
        
        
        const resultado = await usuarios.insertOne(nuevaTarjeta);

        
        console.log(`Tarjeta creada con ID: ${resultado.insertedId}`);
        
        

    } catch (error) {
       
        console.error("Error al guardar la tarjeta en MongoDB:", error);
        res.status(500).json({ error: 'Error interno del servidor al crear la tarjeta' });
    }
});


module.exports = app;