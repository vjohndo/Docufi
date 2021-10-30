const errorhandler = (err, req, res, next) => {
    res.status(500).send(err.message ? {"message" : err.message} : {"message" : "something went wrong"});
};

module.exports = errorhandler;
