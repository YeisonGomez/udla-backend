/* Cargador dinámico de Modelos */
var route = {}
routes_path = process.cwd() + '/routes'
fs.readdirSync(routes_path).forEach(function(file) {
    if (file.indexOf('.js') != -1) {
        route[file.split('.')[0]] = require(routes_path + '/' + file)
    }
})

router.get('/test', route.user.test);
router.post('/login', route.user.logIn);
router.post('/sign-up', route.user.signup);
router.get('/user/get-users', auth.authenticateAdmin, route.user.getAll);
router.delete('/user/delete/:id', auth.authenticateAdmin, route.user.delete);

router.post('/new/create', auth.authenticateAdmin, route.new.create);
router.post('/new/get-all-me', auth.authenticateAdmin, route.new.getAllMe);
router.put('/new/update', auth.authenticateAdmin, route.new.update);
router.get('/new/get-all/:module', route.new.getAll);
router.delete('/new/delete/:id/:module', auth.authenticateAdmin, route.new.delete);

router.post('/event/create', auth.authenticateAdmin, route.event.create);
router.post('/event/get-all-me', auth.authenticateAdmin, route.event.getAllMe);
router.put('/event/update', auth.authenticateAdmin, route.event.update);
router.get('/event/get', route.event.get);
router.get('/event/getAll', route.event.getAll);
router.delete('/event/delete/:id/:module', auth.authenticateAdmin, route.event.delete);


module.exports = router;
