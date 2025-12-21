const express = require('express');
const router = express.Router();
const Model = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register User (Hash Password)
router.post('/add', (req, res) => {
    const { name, email, password, role } = req.body;

    Model.findOne({ email })
        .then(user => {
            if (user) {
                return res.status(400).json({ message: 'Email already exists' });
            } else {
                const salt = 10;
                bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err;
                    const newUser = new Model({
                        name,
                        email,
                        password: hash,
                        role: role || 'user',
                        avatar: req.body.avatar
                    });
                    newUser.save()
                        .then(result => {
                            // Don't send password back
                            const { password, ...userWithoutPassword } = result._doc;
                            res.json(userWithoutPassword);
                        })
                        .catch(err => res.status(500).json(err));
                });
            }
        });
});

// Login User (Verify Hash & Issue Token)
router.post('/authenicate', (req, res) => {
    const { email, password } = req.body;

    Model.findOne({ email })
        .then(user => {
            if (!user) return res.status(401).json({ message: 'Invalid Credentials' });

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = { id: user._id, role: user.role, name: user.name, email: user.email };
                        jwt.sign(
                            payload,
                            process.env.JWT_SECRET,
                            { expiresIn: '1d' },
                            (err, token) => {
                                if (err) return res.status(500).json({ error: "Error signing token" });
                                res.json({
                                    token: "Bearer " + token,
                                    user: payload
                                });
                            }
                        );
                    } else {
                        res.status(401).json({ message: 'Invalid Credentials' });
                    }
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json(err);
        });
});


//getall
router.get('/getall', (req, res) => {
    Model.find({}).select('-password')
        .then((result) => {
            res.json(result);

        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    // res.send('response from product getall');
});

//getid
//colon denotes url parameter
router.get('/getid/:id', (req, res) => {
    // res.send('response from product getid');
    Model.findById(req.params.id).select('-password')
        .then((result) => {
            res.json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

//Deleting data by id
router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

//updating data by id
router.put('/update/:id', (req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((result) => {
            res.json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;
