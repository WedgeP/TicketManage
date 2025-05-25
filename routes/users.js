var express = require('express');
var router = express.Router();
function getAllTickets(){
    return {tickets:[]};
}
function getAllUsers(){
    return {users:[]};
}
function getAllTrains(){
    return {trains:[]};
}
function getAllStations(){
    return {stations:[]};
}
// File: routes/users.js
router.get('/', async function (req, res, next) {
    try {
        let tickets = await getAllTickets();    // fetch tickets from database
        let users = await getAllUsers();
        let trains = await getAllTrains();
        let stations = await getAllStations();
        if (req.user.admin) {
            res.render('adminPanel', { tickets, users, trains, stations });
        } else {
            res.render('userTicket', { tickets });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
