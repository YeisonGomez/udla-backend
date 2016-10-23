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
                var query = connection.query("SELECT *\n" +
                    "FROM\n" +
                    "user\n" +
                    "WHERE\n" +
                    "user.email = ?", [payload.email],
                    function(err, resUser) {
                        if (err) {
                            throw err;
                            console.log("Error Consultando : %s ", err);
                            return res.status(401);
                        } else {
                            if(resUser[0].state != 'active'){
                                return res.status(403).send({ message: "Usuario no autorizado", state: "error" })
                            }else{
                                req.user_id = resUser[0].id;
                                req.user_module = resUser[0].module;
                                req.user_rol = resUser[0].rol;
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
