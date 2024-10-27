import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../Contexts/UserContext";
import { useAuth } from "../../Contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";

import './EditStoryModal.scss';
import '../CreateStoryModal/CreateStoryModal.scss';


function EditStoryModal({ onClose, story }) {
  const [formData, setFormData] = useState({
    storyName: "",
    storySubtitle: "",
    storyDesc: "",
    storyImg: null,
    storyBannerImg: null
  });
  const [storyImagePreview, setStoryImagePreview] = useState(null);
  const [storyBannerImagePreview, setStoryBannerImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const { user } = useUser();
  const { authToken } = useAuth();


  useEffect(() => {
    if (story) {
      setFormData({
        storyName: story.name,
        storySubtitle: story.subtitle,
        storyDesc: story.description,
        storyImg: null,
        storyBannerImg: null
      });

      setStoryImagePreview(story.img);
      setStoryBannerImagePreview(story.bannerImg);
    }
  }, [story]);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const { data } = await axios.get("/api/csrf-token");
      setCsrfToken(data.csrfToken);
    };
    fetchCsrfToken();
  }, []);

  const handleStoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        storyImg: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setStoryImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStoryBannerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        storyBannerImg: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setStoryBannerImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetFormData = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { storyName, storySubtitle, storyDesc, storyImg, storyBannerImg } = formData;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('storyName', storyName);
      formDataToSend.append('storySubtitle', storySubtitle);
      formDataToSend.append('storyDesc', storyDesc);

      // Only append images if new ones were selected
      if (storyImg) {
        formDataToSend.append('storyImg', storyImg);
      }
      if (storyBannerImg) {
        formDataToSend.append('storyBannerImg', storyBannerImg);
      }

      await axios.put(
        `/api/stories/update-story/${story._id}`,
        formDataToSend,
        {
          headers: {
            "csrf-token": csrfToken,
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      if (onClose) onClose();
    } catch (err) {
      setError("Error while updating the story.");
      console.error(`There was an error: ${err}`);
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="edit-story-modal" onClick={(e) => e.stopPropagation()}>
      <div className="story-modal__content">
        <div className="story-modal__header">
          <h2>Edit your story</h2>
        </div>
        <div className="story-modal__body">
          <p className="story-modal__description">
            Update your story's information.
          </p>
          <form onSubmit={handleFormSubmit} className="story-modal__form">
            <div className="story-modal__form-group">
              <div className="story-modal__image-upload" style={{ backgroundImage: `url(${storyImagePreview})` }}>
                <input
                  type="file"
                  id="storyImageUpload"
                  accept=".png, .jpg, .jpeg"
                  className="story-image-input"
                  onChange={handleStoryImageChange}
                />
                <label
                  htmlFor="storyImageUpload"
                  className="story-upload-icon-label"
                >
                  <FontAwesomeIcon icon={faCloudArrowUp} />
                </label>
              </div>
            </div>
            <div className="story-modal__form-group">
              <label htmlFor="storyName" className="story-modal__label">
                Story name*
              </label>
              <input
                type="text"
                id="storyName"
                name="storyName"
                value={formData.storyName}
                onChange={handleSetFormData}
                className="story-modal__input"
                required
              />
            </div>
            <div className="story-modal__form-group">
              <label htmlFor="storySubTitle" className="story-modal__label">
                Subtitle*
              </label>
              <input
                type="text"
                id="storySubtitle"
                name="storySubtitle"
                value={formData.storySubtitle}
                onChange={handleSetFormData}
                className="story-modal__input"
                required
              />
            </div>
            <div className="story-modal__form-group">
              <label htmlFor="storyDesc" className="story-modal__label">
                Description*
              </label>
              <textarea
                id="storyDesc"
                name="storyDesc"
                value={formData.storyDesc}
                onChange={handleSetFormData}
                className="story-modal__textarea"
                required
              />
            </div>
            <div className="story-modal__form-group">
              <div className="story-modal__label">Banner Image</div>
              <div className="story-modal__banner-image-upload" style={{ backgroundImage: `url(${storyBannerImagePreview})`}}>
                <input
                  type="file"
                  id="storyBannerImageUpload"
                  accept=".png, .jpg, .jpeg"
                  className="story-banner-image-input"
                  onChange={handleStoryBannerImageChange}
                />
                <label
                  htmlFor="storyBannerImageUpload"
                  className="story-banner-upload-icon-label"
                >
                  <FontAwesomeIcon icon={faCloudArrowUp} />
                </label>
              </div>
            </div>
            <div className="story-modal__buttons-container">
              <button
                type="button"
                className="story-modal__cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button type="submit" className="story-modal__submit">
                Update
              </button>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditStoryModal;
