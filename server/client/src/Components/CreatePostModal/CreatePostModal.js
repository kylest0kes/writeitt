import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CreatePostModal.scss';

const CreatePostModal = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handlePost = () => {
    // Add your post submission logic here
    console.log({ title, body });
  };

  return (
    <div className="create-post-modal">
      <h3>Create Post</h3>
      <input
        type="text"
        className="post-title"
        placeholder="Title*"
        maxLength="300"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
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
      <button className="post-button" onClick={handlePost} disabled={!title || !body}>
        Post
      </button>
    </div>
  );
};

export default CreatePostModal;
