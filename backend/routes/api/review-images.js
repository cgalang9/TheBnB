const express = require('express')
const router = express.Router()
const sequelize = require("sequelize");
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

require('dotenv').config()
require('express-async-errors')

const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');


router.use(express.json())

// Delete a Review Image
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const img = await ReviewImage.findOne({
        where: { id: req.params.imageId },
        include: Review
    })

    if(!img) {
        let err = new Error("Spot Image couldn't be found")
        err.status = 404
        return next(err)
    }

    const parsedImg = img.toJSON()

    if(parsedImg.Review.userId !== req.user.id) {
        let err = new Error('Forbidden')
        err.status = 403
        return next(err)
    }

    await img.destroy()

    res.json({
        "message": "Successfully deleted",
        "statusCode": 200
      })
})



module.exports = router
