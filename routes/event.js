exports.create = function(req, res) {
    var event = {
        user_id: req.user_id,
        subject: req.body.subject,
        detail: req.body.detail,
        module: req.user_module,
        date: new Date()
    };

    req.getConnection(function(err, connection) {
        connection.query("INSERT INTO events set ? ", news, function(err, result) {
            if (err) {
                res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
            } else {
                res.status(200).send({ message: event, state: "OK" });
            }
        })
    });
}

exports.update = function(req, res) {


}

exports.get = function(req, res) {


}

exports.getAllMe = function(req, res){

}

exports.getAll = function(req, res) {
    req.getConnection(function(err, connection) {
        var query = connection.query(
            "SELECT * FROM events",
            function(err, res) {
                if (err) {
                    throw err;
                    console.log("Error Consultando : %s ", err);
                    res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                } else {
                    res.status(200).send({ message: res, state: "OK" });
                }
            });
    });
}

exports.delete = function(req, res) {

}
