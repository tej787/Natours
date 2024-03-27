import axios from 'axios';
import { showAlert } from './alerts';


export const deleteAccount = async () => {
    const confirmDelete = window.confirm('Are you sure you want to deactivate this Account?');
    if (!confirmDelete) return;
    
    try {
      const res = await axios({
        method: 'DELETE',
        url: `/api/v1/users/deleteMe`
      });
  
      if (res.status === 204) {
        showAlert('success', 'Deleted Account successfully!');
        window.setTimeout(() => {
          location.assign('/')
        }, 1500);
      }
    } catch (err) {
      showAlert('error', err.response.data.message);
    }
  };