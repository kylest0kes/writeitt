import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../Contexts/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";

import "./CreateStoryModal.scss";
import { useAuth } from "../../Contexts/AuthContext";

function CreateStoryModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    storyName: "",
    storySubtitle: "",
    storyDesc: "",
    storyImg: "",
  });
  const [error, setError] = useState("");
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

  const handleSetFormData = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { storyName, storySubtitle, storyDesc } = formData;

    try {
      const res = await axios.post(
        "/api/stories/create-story",
        {
          storyName,
          storySubtitle,
          storyDesc,
          creator: user._id,
        },
        {
          headers: {
            "csrf-token": csrfToken,
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    } catch (err) {
      setError("Error while creating a story.");
      console.error(`There was an error: ${err}`);
    }

    onClose();
  };

  return (
    <div id="story-wrapper">
      <div className="story-modal">
        <div className="story-modal__content">
          <div className="story-modal__header">
            <h2>Tell us about your story</h2>
          </div>
          <div className="story-modal__body">
            <p className="story-modal__description">
              Information to help people understand what your story is all about.
            </p>
            <form onSubmit={handleFormSubmit} className="story-modal__form">
              <div className="story-modal__form-group">
                <div className="story-modal__image-upload">
                  <input
                    type="file"
                    id="storyImageUpload"
                    accept=".png, .jpg, .jpeg"
                    className="story-image-input"
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
                <div className="story-modal__banner-image-upload">
                  <input
                    type="file"
                    id="storyBannerImageUpload"
                    accept=".png, .jpg, .jpeg"
                    className="story-image-input"
                  />
                  <label
                    htmlFor="storyBannerImageUpload"
                    className="story-banner-upload-icon-label"
                  >
                    <FontAwesomeIcon icon={faCloudArrowUp} />
                  </label>
                </div>
              </div>
              <button type="submit" className="story-modal__submit">
                Submit
              </button>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateStoryModal;
