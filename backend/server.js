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

app.use(cors());
app.use(bodyParser.json());

app.get('/locks', async (req, res) => {
    const locks = await Lock.find();
    res.send(locks);
});

app.post('/locks', async (req, res) => {
    const lock = new Lock(req.body);
    await lock.save();
    io.emit('lockChange', await Lock.find());
    res.send(lock);
});

app.put('/locks/:id', async (req, res) => {
    await Lock.findByIdAndUpdate(req.params.id, req.body);
    io.emit('lockChange', await Lock.find());
    res.send('Updated');
});

app.delete('/locks/:id', async (req, res) => {
    await Lock.findByIdAndDelete(req.params.id);
    io.emit('lockChange', await Lock.find());
    res.send('Deleted');
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

const PORT = process.env.PORT || 5000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
