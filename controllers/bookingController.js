const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  // console.log(tour);

  // 2) Create checkout session
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
          unit_amount: tour.price *100 ,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
  });
  

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});


const createBookingCheckout = async session => {
  console.log('createBookingCheckout called'); // Log when createBookingCheckout is called

  const tour = session.client_reference_id;
  console.log('tour', tour);
  const user = (await User.findOne({ email: session.customer_email })).id;
  console.log('user', user);
  console.log( await session.line_items)
  // Check if line_items exists in the session object and if it has at least one item
  if (session.line_items && session.line_items.length > 0) {
    const price = session.line_items[0].unit_amount / 100;
    console.log('Price:', price); // Print the price

    const booking = await Booking.create({ tour, user, price });
    console.log('Booking:', booking); // Log the booking
  } else {
    console.log('line_items does not exist or is empty');
  }
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }
  console.log(event.type)
  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);