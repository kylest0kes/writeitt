import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faTimes } from "@fortawesome/free-solid-svg-icons";
import './CreatePostModal.scss';
import { useUser } from '../../Contexts/UserContext';
import { useAuth } from '../../Contexts/AuthContext';
import axios from 'axios';
import TextToolbar from '../TextToolbar/TextToolbar';

const CreatePostModal = ({ onClose, storyId }) => {
  const [activeTab, setActiveTab] = useState('text');
  const [formData, setFormData] = useState({
    postTitle: "",
    postBody: "",
    postMedia: null,
    author: "",
    story: storyId
  });
  const [postMediaPreview, setPostMediaPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const { user } = useUser();
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const { data } = await axios.get("/api/csrf-token");
      setCsrfToken(data.csrfToken);
    };
    fetchCsrfToken();
  }, []);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, or GIF)');
        return;
      }

      // Validate file size (e.g., 5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        setError('File size should be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        postMedia: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPostMediaPreview(reader.result);
      };
      reader.onerror = () => {
        setError('Error reading file');
      };
      reader.readAsDataURL(file);
    }
  };

  const clearMediaPreview = () => {
    setPostMediaPreview(null);
    setFormData(prev => ({
      ...prev,
      postMedia: null
    }));
  };

  const handleFormSetData = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: formData.postBody,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({
        ...prev,
        postBody: editor.getHTML(),
      }));
    },
  });

  const handlePostFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.postTitle.trim()) {
      setError("Title is required");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('postTitle', formData.postTitle.trim());
    formDataToSend.append('postBody', formData.postBody);
    formDataToSend.append('author', user._id);
    formDataToSend.append('story', storyId);

    if (formData.postMedia) {
      formDataToSend.append('postMedia', formData.postMedia);
    }

    setLoading(true);

    try {
      await axios.post("/api/posts/create-post", formDataToSend, {
        headers: {
          "csrf-token": csrfToken,
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      setFormData({
        postTitle: '',
        postBody: '',
        postMedia: null,
        author: "",
        story: storyId
      });
      setPostMediaPreview(null);
      if (editor) {
        editor.commands.setContent('');
      }

      setLoading(false);
      if (onClose) onClose();

    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Error creating a post");
      console.error("Error creating a post: ", err);
    }
  };

  return (
    <div className="create-post-modal">
      {error && <div className="error-message">{error}</div>}

      <h3>Create Post</h3>
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
        value={formData.postTitle}
        onChange={handleFormSetData}
        id="postTitle"
        name="postTitle"
        required
      />

      {activeTab === 'text' ? (
        <div className="text-editor-container">
          <TextToolbar editor={editor} />
          <EditorContent editor={editor} />
        </div>
      ) : (
        <div className="post-image-container">
          <div
            className="post-image-preview"
            style={{
              backgroundImage: postMediaPreview ? `url(${postMediaPreview})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#272729'
            }}
          >
            <input
              type="file"
              id="postMedia"
              name="postMedia"
              className="image-upload"
              onChange={handleMediaChange}
              accept="image/*, video/*"
              style={{ display: 'none', width: '100%' }}
            />
            {!postMediaPreview ? (
              <label
                htmlFor="postMedia"
                className="post-img-upload-icon-label"
              >
                <FontAwesomeIcon icon={faCloudArrowUp} />
                <span>Upload Image</span>
              </label>
            ) : (
              <button
                className="clear-image-btn"
                onClick={clearMediaPreview}
                type="button"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
        </div>
      )}

      <button
        className="post-button"
        onClick={handlePostFormSubmit}
        disabled={!formData.postTitle.trim() || loading}
      >
        {loading ? 'Posting...' : 'Post'}
      </button>
    </div>
  );
};

export default CreatePostModal;
