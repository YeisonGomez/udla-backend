var jwt = require('jwt-simple');

exports.generateToken = function(user){
 var payload = {
    name: user.name,
    email: user.email,
    rol: user.rol,
    module: user.module
  }
  return (jwt.encode(payload, 'undlaz'));
};