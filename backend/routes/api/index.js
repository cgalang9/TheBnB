const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js');
router.use(restoreUser);

const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js')
const reviewsRouter = require('./reviews.js')
const bookingsRouter = require('./bookings.js')
const spotImgsRouter = require('./spot-images.js')
const reviewImgsRouter = require('./review-images.js')

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter)

router.use('/reviews', reviewsRouter)

router.use('/bookings', bookingsRouter)

router.use('/spot-images', spotImgsRouter)

router.use('/review-images', reviewImgsRouter)

// router.post('/test', (req, res) => {
//   res.json({ requestBody: req.body });
// });

router.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    statusCode: err.status,
    errors: err.errors,
  });
});


module.exports = router;
