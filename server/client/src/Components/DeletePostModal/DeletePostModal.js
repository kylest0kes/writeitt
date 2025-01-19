import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Contexts/AuthContext';
import axios from 'axios';

import './DeletePostModal.scss';

const DeletePostModal = ({ postId, onClose, onDeleteSuccess }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const { authToken } = useAuth();
  
  const fetchCsrfToken = async () => {
    const { data } = await axios.get('/api/csrf-token');
    setCsrfToken(data.csrfToken);
  }

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  const handleDeletePost = async (e) => {
    e.stopPropagation();
    try {
      setLoading(true);
      console.log("sending delete req");
      const response = await axios.delete(`/api/posts/delete-post/${postId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'csrf-token': csrfToken
        },
      });
      console.log("req recieved: ", response.data);
      setLoading(false);
      onDeleteSuccess(postId); 
      onClose(); 
    } catch (err) {
        setLoading(false);
        console.error("Delete failed: ", err.response || err);
        setError("Failed to delete post. Please try again.");
    }
  };

  if (error) {
      return (
        <div className='delete-post-modal-wrapper'>
          <p style={{color: 'red', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{error}</p>
        </div>
    )
  }

  if (loading) {
      return <div className="spinner"></div>;
  }  

  return (
      <div className='delete-post-modal-wrapper' onClick={(e) => e.stopPropagation()}>
          <h1 className='delete-post-heading'>Are You Sure?</h1>

          <p className='delete-post-subheading'>
              This action cannot be undone. All data associated with this post will be deleted if you proceed.
          </p>

          <div className='delete-post-btns-container'>
              <button className='delete-post-cancel-btn' type='button' onClick={(e) => {
                  e.stopPropagation();
                  onClose()
                }}>
                  Cancel
              </button>
              <button className='delete-post-submit-btn' type='button' onClick={(e) => handleDeletePost(e)}>
                {loading ? "Deleting..." : "Delete"}
              </button>
          </div>
      </div>
  )
}

export default DeletePostModal;