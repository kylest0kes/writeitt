import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import './CreatePostModal.scss';

const CreatePostModal = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);

  const handlePost = () => {
    if (activeTab === 'text') {
      console.log({ title, body });
      // Add your post submission logic for text here
    } else if (activeTab === 'image') {
      console.log({ title, image });
      // Add your post submission logic for image here
    }
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="create-post-modal">
      <h3>Create Post</h3>
      {/* Tabs for switching between text and image post types */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'text' ? 'active' : ''}`}
          onClick={() => setActiveTab('text')}
        >
          Text
        </button>
        <button
          className={`tab-button ${activeTab === 'image' ? 'active' : ''}`}
          onClick={() => setActiveTab('image')}
        >
          Image
        </button>
      </div>

      <input
        type="text"
        className="post-title"
        placeholder="Title*"
        maxLength="300"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Conditional rendering for the body or image upload section */}
      {activeTab === 'text' ? (
        <ReactQuill
          value={body}
          onChange={setBody}
          placeholder="Body*"
          modules={{
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link', 'image']
            ]
          }}
        />
      ) : (
        <div>
          <input
            type="file"
            id="postImageUpload"
            className="image-upload"
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <label
            htmlFor="postImageUpload"
            className="post-img-upload-icon-label"
          >
            <FontAwesomeIcon icon={faCloudArrowUp} />
          </label>
        </div>
      )}

      <button className="post-button" onClick={handlePost} disabled={!title || (activeTab === 'text' && !body) || (activeTab === 'image' && !image)}>
        Post
      </button>
    </div>
  );
};

export default CreatePostModal;
