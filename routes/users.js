var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    console.log(req.user);
    if (req.user.admin) {
        res.send('admin');
    } else {
        res.render('userTicket', { tickets: [] });
    }

});

module.exports = router;
