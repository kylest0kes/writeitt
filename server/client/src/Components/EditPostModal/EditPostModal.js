import React, { useEffect, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./EditPostModal.scss";
import TextToolbar from "../TextToolbar/TextToolbar";
import { useAuth } from "../../Contexts/AuthContext";

const EditPostModal = ({ onClose, post, postUpdated }) => {
  const [activeTab, setActiveTab] = useState('text');
  const [formData, setFormData] = useState({
    postTitle: post?.title || "",
    postBody: post?.body || "",
    postMedia: post?.media || null,
    author: post?.author || "",
    story: post?.story || "",
  });

  const [postMediaPreview, setPostMediaPreview] = useState(
    post?.media || null
  );
  const [postTitleLength, setPostTitleLength] = useState(
    post?.title.length || 0
  );
  const [postBodyLength, setPostBodyLength] = useState(
    post?.body.length || 0
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  const { authToken } = useAuth();
  const fileInputRef = useRef(null);

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
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "video/mp4",
        "video/webm",
        "video/ogg",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Invalid file type. Use JPG, PNG, GIF, MP4, WEBM, or OGG.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        postMedia: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPostMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearMediaPreview = () => {
    setPostMediaPreview(null);
    setFormData((prev) => ({
      ...prev,
      postMedia: null,
    }));
  };

  const handleFormSetData = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "postTitle") {
      setPostTitleLength(value.length);
    } else if (name === "postBody") {
      setPostBodyLength(value.length);
    }
  };

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: formData.postBody,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({
        ...prev,
        postBody: editor.getHTML(),
      }));
      setPostBodyLength(editor.getText().length);
    },
  });

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.postTitle.trim()) {
      setError("Title is required");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("postTitle", formData.postTitle.trim());
    formDataToSend.append("postBody", formData.postBody);
    formDataToSend.append("author", formData.author);
    formDataToSend.append("story", formData.story);

    if (formData.postMedia) {
      formDataToSend.append("postMedia", formData.postMedia);
    } else if (post.media && postMediaPreview === null) {
      formDataToSend.append("removeMedia", "true");
    }

    setLoading(true);

    try {
      const { data } = await axios.put(
        `/api/posts/update-post/${post._id}`,
        formDataToSend,
        {
          headers: {
            "csrf-token": csrfToken,
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      postUpdated(data.post);
      setLoading(false);
      if (onClose) onClose();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Error updating post");
      console.error("Error updating post: ", err);
    }
  };

  return (
    <div className="edit-post-modal" onClick={((e) => e.stopPropagation())}>
      {error && <div className="error-message">{error}</div>}
      <h3 className="edit-post-modal-title">Edit Post</h3>

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
         Media
        </button>
      </div>

      <input
        type="text"
        className="post-title"
        placeholder="Title*"
        maxLength={300}
        value={formData.postTitle}
        onChange={handleFormSetData}
        id="postTitle"
        name="postTitle"
        required
      />
      <span className="posttitle-input-len">
        {postTitleLength}{" "}
        {postTitleLength === 300 && (
          <span className="limit-reached">(Limit Reached)</span>
        )}
      </span>

        {activeTab === 'text' ? (
          <div className="text-editor-container">
            <div className="editor-wrapper">
              <TextToolbar editor={editor} />
              <EditorContent editor={editor} />
              <span className="postbody-input-len">
                {postBodyLength}{" "}
                {postBodyLength === 30000 && (
                  <span className="limit-reached">(Limit Reached)</span>
                )}
              </span>
            </div>
          </div>

        ) : (
        <div className="post-image-container">
          <div
            className="post-image-preview"
            style={{
              backgroundImage: postMediaPreview
                ? `url(${postMediaPreview})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              id="postMedia"
              name="postMedia"
              ref={fileInputRef}
              onChange={handleMediaChange}
              accept="image/*, video/*"
              style={{ display: "none" }}
            />
            {!postMediaPreview ? (
              <label className="post-img-upload-icon-label">
                <FontAwesomeIcon icon={faCloudArrowUp} />
                <span>Upload Media</span>
              </label>
            ) : (
              <button
                className="clear-image-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  clearMediaPreview()
                }}
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
        onClick={handlePostUpdate}
        disabled={!formData.postTitle.trim() || formData.postTitle.length < 5 || loading}
      >
        {loading ? "Updating..." : "Update Post"}
      </button>
    </div>
  );
};

export default EditPostModal;
