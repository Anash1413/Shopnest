const exp = require('express');
const { getFavourites, addToFavourites, deleteFromFavourites } = require('../controller/favouritesController');
const { protect } = require('../middlewares/protect');
const favouritesRouter = exp.Router()
favouritesRouter.get('/favourites', protect, getFavourites)
favouritesRouter.post('/favourites', protect, addToFavourites)
favouritesRouter.delete('/favourites', protect, deleteFromFavourites)

module.exports = favouritesRouter ;
