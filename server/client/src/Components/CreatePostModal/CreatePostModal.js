import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import './CreatePostModal.scss';
import { useUser } from '../../Contexts/UserContext';
import { useAuth } from '../../Contexts/AuthContext';
import axios from 'axios';

const CreatePostModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('text');
  const [formData, setFormData] = useState({
    postTitle: "",
    postBody: "",
    postMedia: ""
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
      setCsrfToken(data);
    };
    fetchCsrfToken();
  }, []);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        postMedia: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPostMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSetData = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.postBody,
    onUpdate: ({ editor }) => {
      setFormData(prev => ({
        ...prev,
        postBody: editor.getHTML(), // Store HTML content
      }));
    },
  });

  const handlePostFormSubmit = async (e) => {
    e.preventDefault();

    const { postTitle, postBody, postMedia } = formData;

    const formDataToSend = new FormData();
    formDataToSend.append('postTitle', postTitle);
    formDataToSend.append('postBody', postBody);
    formDataToSend.append('author', user._id);

    if (postMedia) {
      formDataToSend.append('postMedia', postMedia);
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

      setFormData({ postTitle: '', postBody: '', postMedia: null });
      editor.commands.setContent(''); // Reset TipTap content

      setLoading(false);

      if (onClose) onClose();

    } catch (err) {
      setError("Error creating a post: " + err.message);
      console.error("Error creating a post: ", err);
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="create-post-modal">
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
          <EditorContent editor={editor} placeholder="Body" content={formData.postBody}
        onChange={update => setFormData({ ...formData, postBody: update.getHTML() })} />

      ) : (
        <div>
          <input
            type="file"
            id="postMedia"
            name="postMedia"
            className="image-upload"
            onChange={handleMediaChange}
            accept="image/*,video/*"
            style={{ display: 'none' }}
          />
          <label
            htmlFor="postMedia"
            className="post-img-upload-icon-label"
          >
            <FontAwesomeIcon icon={faCloudArrowUp} />
          </label>
        </div>
      )}

      <button className="post-button" onClick={handlePostFormSubmit} disabled={!formData.postTitle}>
        Post
      </button>
    </div>
  );
};

export default CreatePostModal;
