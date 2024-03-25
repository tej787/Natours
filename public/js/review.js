import axios from 'axios';
import { showAlert } from './alerts';

export const addreview = async (review, rating,tour) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/reviews',
      data: {
        review,
        rating,
        tour
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Your review has been added successfully! This will be help us to improve service! \n Thank You!!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};




export const redirectToReviewPage = () => {
  // Get the current URL
  const currentUrl = window.location.href;

  // Append "/review" to the current URL
  const reviewUrl = `${currentUrl}/review`;

  // Redirect the user to the modified URL
  window.location.href = reviewUrl;
};


export const deleteReview = async (reviewId) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this review?');
  if (!confirmDelete) return;

  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/reviews/${reviewId}`
    });

    if (res.status === 204) {
      showAlert('success', 'Deleted review successfully!');
      window.setTimeout(() => {
        location.assign('/my-reviews')
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

