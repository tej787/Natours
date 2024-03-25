import axios from 'axios';
import { showAlert } from './alerts';

export const forgotPassword = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword/',
      data: {
        email
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Email Send Successfully To Your Account!');
      window.setTimeout(() => {
        location.assign('/users/forgotPassword/mail');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};



export const resetPassword = async (resetToken,password,passwordConfirm) => {
    try {
        console.log(resetToken)
      const res = await axios({
        method: 'PATCH',
        url: `/api/v1/users/resetPassword/${resetToken}`,
        data: {
            password,
            passwordConfirm
        }
      });
  
      if (res.data.status === 'success') {
        showAlert('success', 'Your Password Reset Successfully!');
        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
      }
      
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  };