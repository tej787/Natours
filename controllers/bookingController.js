const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
console.log('Stripe:', !!stripe); // Check if Stripe is defined

const Tour = require('../models/tourModel');
console.log('Tour Model:', !!Tour); // Check if Tour model is defined

const User = require('../models/userModel');
console.log('User Model:', !!User); // Check if User model is defined

const Booking = require('../models/bookingModel');
console.log('Booking Model:', !!Booking); // Check if Booking model is defined

const catchAsync = require('../utils/catchAsync');
console.log('catchAsync:', !!catchAsync); // Check if catchAsync is defined

const factory = require('./handlerFactory');
console.log('Factory:', !!factory); // Check if factory is defined

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  console.log('getCheckoutSession called'); // Log when getCheckoutSession is called

  const tour = await Tour.findById(req.params.tourId);
  console.log('Tour:', tour); // Log the tour

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`
            ],
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  });
  console.log('Session:', session); // Log the session

  res.status(200).json({
    status: 'success',
    session
  });
});

const createBookingCheckout = async session => {
  console.log('createBookingCheckout called'); // Log when createBookingCheckout is called

  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.display_items[0].amount / 100;

  const booking = await Booking.create({ tour, user, price });
  console.log('Booking:', booking); // Log the booking
};

exports.webhookCheckout = (req, res, next) => {
  console.log('webhookCheckout called'); // Log when webhookCheckout is called

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook error:', err.message); // Log the error message
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  console.log('Event type:', event.type); // Log the event type

  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
