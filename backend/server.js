const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const http = require('http').createServer(app);
const io = new Server(http);

// Conexión a MongoDB Atlas
const mongoUri = 'mongodb+srv://Javier:12345678*@javiercortez.ajfwqmp.mongodb.net/?retryWrites=true&w=majority&appName=JavierCortez';
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB Atlas");
}).catch((error) => {
    console.error("Error connecting to MongoDB Atlas: ", error);
});

const LockSchema = new mongoose.Schema({
    name: String,
    photo: String,
    isActive: Boolean
});

const Lock = mongoose.model('Lock', LockSchema);

app.use(cors({
    origin: '*', // Permitir todas las solicitudes
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

app.get('/locks', async (req, res) => {
    try {
        const locks = await Lock.find();
        res.send(locks);
    } catch (error) {
        console.error('Error fetching locks:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/locks', async (req, res) => {
    try {
        const lock = new Lock(req.body);
        await lock.save();
        const locks = await Lock.find();
        io.emit('lockChange', locks);
        res.send(lock);
    } catch (error) {
        console.error('Error creating lock:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/locks/:id', async (req, res) => {
    try {
        await Lock.findByIdAndUpdate(req.params.id, req.body);
        const locks = await Lock.find();
        io.emit('lockChange', locks);
        res.send('Updated');
    } catch (error) {
        console.error('Error updating lock:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/locks/:id', async (req, res) => {
    try {
        await Lock.findByIdAndDelete(req.params.id);
        const locks = await Lock.find();
        io.emit('lockChange', locks);
        res.send('Deleted');
    } catch (error) {
        console.error('Error deleting lock:', error);
        res.status(500).send('Internal Server Error');
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
