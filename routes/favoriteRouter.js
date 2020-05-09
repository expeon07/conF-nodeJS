const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.corsWithOptions, authenticate.verifyUser,function(req, res, next) {
    Favorites.find({ 'user': req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(favorites);
    })
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({ 'user': req.user._id})
    .then((err, favorites) => {
        // if favorite already in list, dont add
        if (favorites != null) {
            for (var i = (favorites.dishes.length -1); i >= 0; i--) {
                if (favorite.dishes.indexOf(req.body[i]._id) === -1) {
                    favorite.dishes.push(req.body[i]._id);
                    console.log('Favorite added!');
                }
            }
            favorites.save()
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
        }
        else {
            Favorites.create({ 'user': req.user._id, 'dishes': [] })
            .then((err, favorites) => {
                favorites.dishes.push(req.body);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err));  
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({ 'user': req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/'+ req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({ 'user': req.user._id})
    .then((err, favorites) => {
        // if favorite already in list, dont add
        if (favorites != null) {
            if (favorite.dishes.indexOf(req.params.dishId) === -1) {
                favorites.dishes.push(req.params.dishId);
                console.log('Favorite added!');
            }
            favorites.save()
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
        }
    
        else {
            Favorites.create({ 'user': req.user._id, 'dishes': [] })
            .then((err, favorites) => {
                favorites.dishes.push(req.params.dishId);
                res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                }, (err) => next(err))  
        }
    }, (err) => next(err))
    .catch((err) => next(err));  
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({ 'user': req.user._id})
    .then((err, favorites) => {
        if (favorite.dishes.indexOf(req.params.dishId) === -1) {
            favorites.dishes.remove(req.params.dishId);
        }
        favorites.save()
        .then((favorites) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        }, (err) => next(err))
    }, (err) => next(err))
    .catch((err) => next(err));  
})

module.exports = favoriteRouter;