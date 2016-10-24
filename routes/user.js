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
                                user.module = input.module;

                                connection.query("SELECT module_id FROM module WHERE module_description = ?", [input.module],
                                    function(err3, moduleId) {
                                        if (err3) {
                                            throw err3;
                                            console.log("Error Consultando : %s ", err3);
                                            return res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                                        } else {
                                            if (moduleId[0] == undefined) {
                                                return res.status(401).send({ message: 'Error al agregar el modulo', state: "error" });
                                            } else {
                                                connection.query("INSERT INTO user_module set ?", { user_id: user.id, module_id: moduleId[0].module_id }, function(err4, resultModule) {
                                                    if (err4) {
                                                        console.log("Error Consultando : %s ", err4);
                                                        return res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                                                    } else {
                                                        return res.status(200).send({ message: user, state: "OK" });
                                                    }
                                                });
                                            }
                                        }
                                    });
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
                                connection.query("SELECT\n" +
                                    "GROUP_CONCAT(module.module_description) AS module_description, \n" +
                                    "GROUP_CONCAT(module.module_spanish) AS module_spanish FROM user_module\n" +
                                    "INNER JOIN module ON user_module.module_id = module.module_id\n" +
                                    "WHERE user_module.user_id = ?", [resUser[0].id],
                                    function(err3, resModule) {
                                        if (err3) {
                                            throw err3;
                                            console.log("Error Consultando : %s ", err3);
                                            return res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                                        } else {
                                            console.log(resModule[0]);
                                            var payload = {
                                                name: resUser[0].name,
                                                email: resUser[0].email,
                                                rol: resUser[0].rol,
                                                module: resModule[0].module_description,
                                                module_detail: resModule[0].module_spanish
                                            };
                                            return res.status(200).send({ token: util.generateToken(payload), state: "OK" });
                                        }
                                    });
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
            "SELECT\n" +
            "`user`.id,\n" +
            "`user`.email,\n" +
            "`user`.`name`,\n" +
            "`user`.lastname,\n" +
            "`user`.date_signup,\n" +
            "GROUP_CONCAT(module.module_description) as module,\n" +
            "GROUP_CONCAT(module.module_spanish) AS module_spanish\n" +
            "FROM\n" +
            "`user`\n" +
            "INNER JOIN user_module ON user_module.user_id = `user`.id\n" +
            "INNER JOIN module ON user_module.module_id = module.module_id\n" +
            "WHERE\n" +
            "`user`.state = 'active'\n" +
            "GROUP BY\n" +
            "`user`.id",
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

exports.deleteModule = function(req, res) {
    req.getConnection(function(err, connection) {
        connection.query("SELECT * FROM module WHERE module.module_description = ?", req.params.module,
            function(err, resModule) {
                if (err) {
                    throw err;
                    console.log("Error Consultando : %s ", err);
                    return res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                } else {
                    connection.query(
                        "DELETE FROM user_module\n" +
                        "WHERE user_module.module_id = ? AND user_module.user_id = ?", [resModule[0].module_id, req.params.id],
                        function(err2, res2) {
                            if (err2) {
                                throw err2;
                                console.log("Error Consultando : %s ", err2);
                                return res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                            } else {
                                return res.status(200).send({ message: "OK", state: "OK" });
                            }
                        });
                }
            });
    });
}

exports.addModule = function(req, res) {
    req.getConnection(function(err, connection) {
        connection.query("SELECT * FROM module WHERE module.module_description = ?", req.body.mod,
            function(err, resModule) {
                if (err) {
                    throw err;
                    console.log("Error Consultando : %s ", err);
                    return res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                } else {
                    connection.query(
                        "INSERT INTO user_module set ?", { user_id: req.body.id, module_id: resModule[0].module_id },
                        function(err2, res2) {
                            if (err2) {
                                throw err2;
                                console.log("Error Consultando : %s ", err2);
                                return res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                            } else {
                                return res.status(200).send({ message: resModule[0].module_spanish, state: "OK" });
                            }
                        });
                }
            });
    });
}

exports.setPassword = function(req, res) {
    req.getConnection(function(err, connection) {
        connection.query(
            "UPDATE user SET password = ? WHERE id = ?", [req.body.pass, req.body.id],
            function(err2, res2) {
                if (err2) {
                    throw err2;
                    console.log("Error Consultando : %s ", err2);
                    return res.status(503).send({ message: 'Error de conexion con la base de datos', state: "error" });
                } else {
                    return res.status(200).send({ message: "OK", state: "OK" });
                }
            });
    });
}
