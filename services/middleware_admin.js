var jwt = require('jwt-simple');
var config = require('../config');

exports.authenticateAdmin = function(req, res, next) {
    try {
        if (!req.headers.authorization) {
            return res
                .status(403)
                .send({ message: "Petición no Autorizada", state: "error" });
        }

        var token = req.headers.authorization.split(" ")[1];

        try {
            var payload = jwt.decode(token, 'undlaz');
        } catch (err) {
            return res.status(403)
                .send({ message: "Petición no Autorizada", state: "error" })
        }

        if (payload.rol == "admin" || payload.rol == "superadmin") {
            req.getConnection(function(err, connection) {
                var query = connection.query("SELECT\n" +
                    "`user`.id,\n" +
                    "`user`.email,\n" +
                    "`user`.`password`,\n" +
                    "`user`.`name`,\n" +
                    "`user`.lastname,\n" +
                    "`user`.rol,\n" +
                    "`user`.date_signup,\n" +
                    "`user`.state,\n" +
                    "GROUP_CONCAT(module.module_description) as module\n" +
                    "FROM\n" +
                    "`user`\n" +
                    "INNER JOIN user_module ON user_module.user_id = `user`.id\n" +
                    "INNER JOIN module ON user_module.module_id = module.module_id\n" +
                    "WHERE\n" +
                    "`user`.email = ?\n" +
                    "GROUP BY\n" +
                    "`user`.id", [payload.email],
                    function(err, resUser) {
                        if (err) {
                            throw err;
                            console.log("Error Consultando : %s ", err);
                            return res.status(401);
                        } else {
                            if (resUser[0].state != 'active') {
                                return res.status(403).send({ message: "Usuario no autorizado", state: "error" })
                            } else {
                                req.user_id = resUser[0].id;
                                req.user_rol = resUser[0].rol;
                                req.user_module = resUser[0].module;
                                next();
                            }

                        }
                    });
            });
        } else {
            return res.status(403)
                .send({ message: "Petición no Autorizada", state: "error" })
        }
    } catch (err) {
        return res
            .status(401)
            .send({ message: "El token no es valido", state: "error" });
    }

}
