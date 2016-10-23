exports.create = function(req, res) {
    var news = {
        user_id: req.user_id,
        subject: req.body.subject,
        detail: req.body.detail,
        content: req.body.content,
        module: req.user_module,
        img: "",
        date_edit: new Date()
    };

    req.getConnection(function(err, connection) {
        connection.query("INSERT INTO news set ? ", news, function(err, result) {
            if (err) {
                console.log("Error Consultando : %s ", err);
                res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
            } else {
                news.id = result.insertId;
                res.status(200).send({ message: news, state: "OK" });
            }
        })
    });
}

exports.update = function(req, res) {
    var input = {
        subject: req.body.subject,
        detail: req.body.detail,
        content: req.body.content,
        img: req.body.img,
    };
    req.getConnection(function(err, connection) {

        connection.query("UPDATE news SET subject = ?, detail = ?, content = ?, img = ? WHERE user_id = ?", [input.subject, input.detail, input.content, input.img],
            function(err, rows) {
                if (err) {
                    console.log("Error Selecting : %s ", err);
                    res.json(err);
                } else {
                    res.json(rows);
                }
            });
    });

}

exports.getAll = function(req, res) {
    req.getConnection(function(err, connection) {
        var query = connection.query(
            "SELECT * FROM news WHERE module = ?", req.params.module,
            function(err, resUser) {
                if (err) {
                    throw err;
                    console.log("Error Consultando : %s ", err);
                    res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                } else {
                    res.status(200).send({ message: resUser, state: "OK" });
                }
            });
    });
}

exports.getAllMe = function(req, res) {
    req.getConnection(function(err, connection) {
        var query = connection.query(
            "SELECT * FROM news WHERE user_id = ? AND module = ?", [req.user_id, req.user_module],
            function(err, resUser) {
                if (err) {
                    throw err;
                    console.log("Error Consultando : %s ", err);
                    res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                } else {
                    res.status(200).send({ message: resUser, state: "OK" });
                }
            });
    });
}

exports.delete = function(req, res) {
    var id = req.params.id;
    if (req.params.module == req.user_module) {
        req.getConnection(function(err, connection) {
            var query = connection.query("DELETE FROM news WHERE id = ?", id,
                function(err, resD) {
                    if (err) {
                        throw err;
                        console.log("Error Consultando : %s ", err);
                        res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                    } else {
                        res.status(200).send({ message: id, state: "OK" });
                    }
                });
        });
    } else {
        res.status(400).send({ message: 'Acceso Denegado', state: "error" });
    }
}
