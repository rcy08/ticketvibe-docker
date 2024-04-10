require('dotenv').config();

const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
    // Fork workers based on the number of CPU cores
    const numCPUs = os.cpus().length;
  
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  
    // Handle worker death and respawn
    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died. Restarting...`);
      cluster.fork();
    });
} 
else {

    const express = require('express');
    const mongoose = require('mongoose');
    const compression = require('compression');
    const redisClient = require('./utils/redisClient');

    (async () => {
        // Connect to redis server
        await redisClient.connect();
    })();    

    const cors = require('cors');

    const app = express();

    app.use(express.json());
    app.use(compression());
    app.use(cors());

    app.use(
        cors({
            origin: process.env.CLIENT_DOMAIN,
            credentials: true,
        })
    );

    app.use((req, res, next) => {
        res.setHeader(
            "Access-Control-Allow-Origin",
            process.env.CLIENT_DOMAIN
        );
        res.header(
            "Access-Control-Allow-Origin",
            "Origin,X-Requested-With,Content-Type,Accept",
            "Access-Control-Allow-Methods: GET, DELETE, PUT, PATCH, HEAD, OPTIONS, POST"
        );
        next();
    });

    redisClient.on('ready', () => {

        console.log('Connected to Redis server');

        mongoose.connect(process.env.MONGO_URI)
        .then(() => {

            app.get('/', (req, res) => {
                const url = process.env.CLIENT_DOMAIN;
                res.send(`<a href=${url}>${url}</a>`);
            });

            const authRoutes = require('./routes/authRoutes');

            app.use('/auth', authRoutes);

            const eventRoutes = require('./routes/eventRoutes');

            app.use('/events', eventRoutes);

            app.listen(process.env.PORT, () => {
                console.log(`Connected to db and listening on port ${process.env.PORT}`);
            });

        })
        .catch((err) => {
            console.log(`Error connecting to DB: ${err}`);
        })

    })

    redisClient.on('error', (err) => {
        console.error('Error connecting to Redis server:', err);
        process.exit(1); // Exit the process if unable to connect to Redis
    });

}