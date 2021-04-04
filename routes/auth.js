const koaRouter = require('koa-router');

const { signup } = require('../controllers/auth');
const { signupUserValidator } = require('../validator');

const router = new koaRouter();

router.post('/auth/signup', signup);

module.exports = router;