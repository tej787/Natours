// reviewModel.js

const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  const nRating = stats.length > 0 ? stats[0].nRating : 0;
  const avgRating = stats.length > 0 ? stats[0].avgRating : 4.5;

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: nRating,
    ratingsAverage: avgRating
  });
};

reviewSchema.post('save', function(doc) {
  this.constructor.calcAverageRatings(doc.tour);
});

// Middleware for updating average ratings after findOneAndUpdate and findOneAndDelete
const recalculateAverageRatings = async function(doc) {
  await doc.constructor.calcAverageRatings(doc.tour);
};

reviewSchema.post(/^findOneAnd/, recalculateAverageRatings);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
