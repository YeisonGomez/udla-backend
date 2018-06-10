var storage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, cb) {
        cb(null, './public/img-public/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + file.originalname);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');


exports.create = function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }

        var news = {
            user_id: req.user_id,
            subject: req.body.n.subject,
            detail: req.body.n.detail,
            content: req.body.n.content,
            module: req.body.m,
            img: 0,
            date_edit: new Date()
        };

        req.getConnection(function(err, connection) {
            var imagen = ("/img-public/" + req.file.filename);
            connection.query("SELECT * FROM image WHERE image_detail = ?", imagen,
                function(erro, result) {
                    if (erro) {
                        console.log("Error Consultando : %s ", erro);
                        res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                    } else {
                        if (result[0] != undefined) {
                            news.img = result[0].id;
                            
                            connection.query("INSERT INTO news set ? ", news, function(err2, result2) {
                                if (err2) {
                                    console.log("Error Consultando : %s ", err2);
                                    res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                                } else {
                                    news.id = result2.insertId;
                                    news.view_img = result[0].image_detail;
                                    res.status(200).send({ message: news, state: "OK" });
                                }
                            });
                        } else {
                            connection.query("INSERT INTO image set ? ", { image_detail: imagen },
                                function(err3, result3) {
                                    if (err3) {
                                        console.log("Error Consultando : %s ", err3);
                                        res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                                    } else {
                                        news.img = result3.insertId;
                                        connection.query("INSERT INTO news set ? ", news, function(err2, result2) {
                                            if (err2) {
                                                console.log("Error Consultando : %s ", err2);
                                                res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                                            } else {
                                                news.id = result2.insertId;
                                                news.view_img = imagen;
                                                res.status(200).send({ message: news, state: "OK" });
                                            }
                                        });
                                    }
                                });
                        }
                    }
                })

        });
    });

}

exports.update = function(req, res) {
    var input = {
        subject: req.body.subject,
        detail: req.body.detail,
        content: req.body.content,
        img: req.body.img,
        date_edit: new Date()
    };
    req.getConnection(function(err, connection) {
        connection.query("UPDATE news SET subject = ?, detail = ?, content = ?, img = ?, date_edit = ? WHERE user_id = ? AND id = ?", [input.subject, input.detail, input.content, input.img, input.date_edit, req.user_id, req.body.id],
            function(err, rows) {
                if (err) {
                    console.log("Error Selecting : %s ", err);
                    res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                } else {
                    res.status(200).send({ message: "OK", state: "OK" });
                }
            });
    });

}

exports.getAll = function(req, res) {
    req.getConnection(function(err, connection) {
        var query = connection.query(
            "SELECT \n" +
            "news.id,\n" +
            "news.user_id,\n" +
            "news.`subject`,\n" +
            "news.detail,\n" +
            "news.content,\n" +
            "news.module,\n" +
            "news.date_edit,\n" +
            "news.img,\n" +
            "image.image_detail AS view_img\n" +
            "FROM news INNER JOIN image ON news.img = image.id WHERE module = ? ", req.params.module,
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
            "SELECT \n" +
            "news.id,\n" +
            "news.user_id,\n" +
            "news.`subject`,\n" +
            "news.detail,\n" +
            "news.content,\n" +
            "news.module,\n" +
            "news.date_edit,\n" +
            "news.img,\n" +
            "image.image_detail AS view_img\n" +
            "FROM news INNER JOIN image ON news.img = image.id WHERE user_id = ? AND module = ?", [req.user_id, req.body.module],
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
}