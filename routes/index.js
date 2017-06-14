var express = require('express');
var router = express.Router();

/* Get index page */
router.get('/', function(req, res, next) {            //此路径渲染index文件，index.html
    res.render('index', { title: '登录/注册' });
});

/* Get login page */
router.route('/login').get(function(req,res) {          //此路径渲染login文件，login.html
    res.render('login', { title: 'User login'});
}).post(function(req, res) {                               //进行post数据的处理操作
    var User = global.dbHandel.getModel('user');
    var uname = req.body.uname;                           //获取post上来的data数据中uname的值
    User.findOne({ name: uname },function(err, doc) {
        if (err) {                                        //错误返回给login.html状态码为500的错误
            res.send(500);
            console.log(err);
        } else if (!doc) {                                //查询不到用户匹配信息，返回状态码为404的用户不存在错误
            req.session.error = '用户不存在';
            res.send(404);
            // res.redirect('/login');
        } else {
            if (req.body.upwd != doc.password) {              //查询到用户信息，密码不匹配
                req.session.error = '密码错误';
                res.send(404);
                // res.redirect('/login');
            } else {                                         //信息匹配成功，则将此对象user赋给session.user，并返回成功 
                req.session.user = doc;
                res.send(200);
                // res.redirect('/home');
            }
        }
    });

});

/* Get register page */
router.route('/register').get(function(req,res) {              //此路径则渲染register文件，register.html 
    res.render('register', { title: 'User register'});
}).post(function(req, res) {
    var User = global.dbHandel.getModel('user');
    var uname = req.body.uname;
    var upwd = req.body.upwd;
    User.findOne({ name: uname}, function(err, doc) {
        if (err) {
            res.send(500);
            req.session.error = '网络异常错误';
            console.log(err);
        } else if (doc) {
            res.send(500);
            req.session.error = '用户已存在';
        } else {
            User.create({                                       //创建一组user对象置入model
                name: uname,
                password: upwd
            }, function(err, doc) {
                if (err) {
                    res.send(500);
                    console.log(err);
                } else {
                    req.session.error = '用户创建成功！';
                    res.send(200);
                }
            });
        }
    });
});

/* Get home page */
router.get('/home', function(req, res) {
    if (!req.session.user) {                             //到达/home路径首先判断是否已经登录
        req.session.error = '请先登录';
        res.redirect('/login');
    }
    res.render('home', {title: 'Home Page'});
})

/* Get logout page */
router.get('/logout', function(req, res) {                //退出登录，session置空，回到根路径
    req.session.user = null;
    req.session.error = null;
    res.redirect('/');
});

module.exports = router;
