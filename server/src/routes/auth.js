var app = module.exports = require('express')();
var Model = require('../models/user');
var lodash = require('lodash');

app.get('/id/:id', async (req, res) => {
        var format = {
                error: false,
                message: '',
                data: null
        };
        const id = req.params.id;
        try {
                const result = await Model.findById(id);
                if (result !== null) {
                        format.message = 'ok';
                        format.data = result;
                        res.json(format);
                }
        } catch (error) {
                format.error = true;
                format.message = error.message;
                format.data = error;
                res.status(500).json(format);
        }
})

app.post('/signup', async (req, res) => {
        var format = {
                error: false,
                message: '',
                data: null
        };
        try {
                if (lodash.isEmpty(req.body.name)) {
                        format.error = true;
                        format.message = 'Tên không được để trống !';
                        res.json(format);
                } else if (lodash.isEmpty(req.body.email)) {
                        format.error = true;
                        format.message = 'Email không được để trống !';
                        res.json(format);
                } else if (lodash.isEmpty(req.body.password)) {
                        format.error = true;
                        format.message = 'Mật khẩu không được để trống !';
                        res.json(format);
                } else if (lodash.isEmpty(req.body.phone)) {
                        format.error = true;
                        format.message = 'Số điện thoại không được để trống !';
                        res.json(format);
                } else {
                        var user = {
                                name: req.body.name,
                                email: req.body.email,
                                password: req.body.password,
                                avatar: null,
                                phone: parseInt(req.body.phone),
                                authorities: 'client',
                                date_register: Date.now()
                        };
                        try {
                                var options = {
                                        email: req.body.email
                                };
                                const result = await Model.find(options);
                                if (result.length > 0) {
                                        format.error = true;
                                        format.message = 'Tài khoản đã tồn tại !';
                                        format.data = result[0];
                                        res.json(format);
                                } else {
                                        try {
                                                var results = await Model.create(user);
                                                results.password = null;
                                                format.error = false;
                                                format.message = 'Tạo tài khoản thành công !';
                                                format.data = results;
                                                res.json(format);
                                        } catch (error) {
                                                format.error = true;
                                                format.message = 'Tạo tài khoản không thành công !';
                                                format.data = error;
                                                res.json(format);
                                        }
                                }
                        } catch (error) {
                                format.error = true;
                                format.message = '';
                                format.data = error;
                                res.json(format);
                        }
                }
        } catch (error) {
                console.log('error: ', error);
        }
});

app.post('/login', async (req, res) => {
        var format = {
                error: false,
                message: '',
                data: null
        };
        if (lodash.isEmpty(req.body.email)) {
                error = true;
                message = 'Email không được để trống !';
                let result = {
                        error: error,
                        message: message,
                        data: data
                };
                res.json(result);
        } else if (lodash.isEmpty(req.body.password)) {
                error = true;
                message = 'Mật khẩu không được để trống !';
                let result = {
                        error: error,
                        message: message,
                        data: data
                };
                res.json(result);
        } else {
                try {
                        const options = {
                                email: req.body.email
                        };
                        let result = await Model.find(options);
                        if (result.length === 0) {
                                format.error = true;
                                format.message = 'Email không tồn tại !';
                                format.data = null;
                                res.json(format);
                        } else {
                                if (req.body.password === result[0].password) {
                                        format.error = false;
                                        format.message = 'Đăng nhập thành công !';
                                        format.data = result[0];
                                        res.json(format);
                                } else {
                                        format.error = true;
                                        format.message = 'Sai mật khẩu !';
                                        format.data = null;
                                        res.json(format);
                                }
                        }
                } catch (error) {
                        console.log('error: ', error);
                        format.error = true;
                        format.message = error.message;
                        format.data = error;
                        res.status(500).json(format);
                }
        }
});