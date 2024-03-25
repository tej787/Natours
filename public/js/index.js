/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { signup } from './signup';
import { redirectToReviewPage ,addreview ,deleteReview} from './review';
import { forgotPassword , resetPassword} from './password';
import {deleteAccount} from './deleteAccount';

import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const deleteAcoountBtn = document.getElementById('deleteAccount');

const addreviewBtn = document.getElementById('add-review');
const submitreviewBtn = document.getElementById('submit-review');
const signupForm = document.querySelector('.signup-form');
const forgotForm = document.querySelector('.forgot-form');
const resetForm = document.querySelector('.reset-form');




// DELEGATION
if (mapBox) {
  displayMap();
}

if (loginForm)
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const submitButton = e.target.querySelector('button');
    submitButton.textContent = 'Login...';

    // Call the forgotPassword function
    await login(email, password);;

    // Change the button text back to "Submit"
    submitButton.textContent = 'Login';
    
  });

  if (signupForm)
  signupForm.addEventListener('submit',async e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const submitButton = e.target.querySelector('button');
    submitButton.textContent = 'Submitting...';

    
    await signup(name, email, password, passwordConfirm);

    
    submitButton.textContent = 'Sign Up';

    
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);


    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

  if (forgotForm)
  forgotForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const submitButton = e.target.querySelector('button');
    
    // Change the button text to "Sending..."
    submitButton.textContent = 'Sending...';

    // Call the forgotPassword function
    await forgotPassword(email);

    // Change the button text back to "Submit"
    submitButton.textContent = 'Submit';
  });

  if (resetForm)
  resetForm.addEventListener('submit', e => {
  e.preventDefault();
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('passwordConfirm').value;
  const resetToken = document.getElementById('resetToken').value;
  resetPassword(resetToken, password, passwordConfirm);
});


if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

  if (deleteAcoountBtn)
  deleteAcoountBtn.addEventListener('click', e => {
    deleteAccount();
  });

  
const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);

if (addreviewBtn){
  addreviewBtn.addEventListener('click', e => {
    redirectToReviewPage()
  });
  
}

if (submitreviewBtn){
  submitreviewBtn.addEventListener('click', async e => {
    e.preventDefault();
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    const tour = document.getElementById('tourId').value;

    addreview(review,rating,tour);
  });
}

document.querySelectorAll('.btn--green-review').forEach(button => {
  button.addEventListener('click', function() {
    const reviewId = this.dataset.id;
    deleteReview(reviewId);
  });
});

