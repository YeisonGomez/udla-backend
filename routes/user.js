var util = require('../helper/util.js');

exports.test = function(req, res) {
    res.send("Hola testeo");
}

exports.signup = function(req, res) {

    var input = JSON.parse(JSON.stringify(req.body));

    var user = {
        email: input.email,
        password: input.password,
        name: input.name,
        lastname: input.lastname,
        //module: input.module,
        date_signup: new Date(),
        rol: 'admin',
        state: 'active'
    };

    req.getConnection(function(err, connection) {
        connection.query("SELECT id FROM user WHERE email = ?", [user.email],
            function(err, resUser) {
                if (err) {
                    throw err;
                    console.log("Error Consultando : %s ", err);
                    return res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                } else {
                    if (resUser[0] != undefined) {
                        return res.status(401).send({ message: 'El usuario ya existe.', state: "error" });
                    } else {
                        connection.query("INSERT INTO user set ? ", user, function(err2, result) {
                            if (err2) {
                                console.log("Error Consultando : %s ", err2);
                                return res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                            } else {
                                user.id = result.insertId;

                                connection.query("SELECT module_id FROM module WHERE module_description = ?", [input.module],
                                    function(err, moduleId) {
                                        if (err) {
                                            throw err;
                                            console.log("Error Consultando : %s ", err);
                                            return res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                                        } else {

                                        }
                                    });
                                return res.status(200).send({ message: user, state: "OK" });
                            }
                        })
                    }
                }
            });

    })
}

exports.logIn = function(req, res) {

    var email = req.body.email ||  '';
    var password = req.body.password ||  '';

    req.getConnection(function(err, connection) {
        var query = connection.query(
            "SELECT * FROM user WHERE user.email = ?", [email],
            function(err, resUser) {
                if (err) {
                    throw err;
                    console.log("Error Consultando : %s ", err);
                    return res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                } else {
                    if (resUser.length === 0) {
                        return res.status(401).send({ message: 'El usuario no existe', state: "error" });
                    } else {

                        if (resUser[0].state != 'active') {
                            return res.status(401).send({ message: 'La cuenta ha sido desactivada', state: "error" });
                        } else {
                            if (password == resUser[0].password) {
                                var payload = {
                                    name: resUser[0].name,
                                    email: resUser[0].email,
                                    rol: resUser[0].rol,
                                    module: resUser[0].module
                                };
                                return res.status(200).send({ token: util.generateToken(payload), state: "OK" });

                            } else {
                                return res.status(401).send({ message: 'Contraseña Incorrecta', state: "error" });
                            }
                        }
                    }
                }
            }
        )
    })
}

exports.getAll = function(req, res) {
    req.getConnection(function(err, connection) {
        var query = connection.query(
            "SELECT id, email, name, lastname, module, date_signup FROM user WHERE state = 'active'",
            function(err, resUser) {
                if (err) {
                    throw err;
                    console.log("Error Consultando : %s ", err);
                    return res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                } else {
                    return res.status(200).send({ message: resUser, state: "OK" });
                }
            });
    });
}

exports.delete = function(req, res) {
    var id = req.params.id;
    req.getConnection(function(err, connection) {
        var query = connection.query(
            "DELETE FROM user WHERE id = ?", id,
            function(err, resUser) {
                if (err) {
                    throw err;
                    console.log("Error Consultando : %s ", err);
                    return res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                } else {
                    return res.status(200).send({ message: id, state: "OK" });
                }
            });
    });
}
