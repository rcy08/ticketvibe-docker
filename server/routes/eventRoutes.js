const express = require('express');

const router = express.Router();

const { auth } = require('../middlewares/auth');

const { 
    allEvents, 
    getEvent, 
    createEvent, 
    updateEvent, 
    deleteEvent, 
    bookEvent,
    saveEvent 
} = require('../controllers/eventController');

// const cacheMiddleware = require('../middlewares/cacheMiddleware');

router.post('/', allEvents);

router.get('/:id', getEvent);

router.post('/create', auth, createEvent);

router.post('/update', updateEvent);

router.delete('/delete/:id', auth, deleteEvent);

router.post('/book', auth, bookEvent);

router.post('/save', auth, saveEvent);

module.exports = router;