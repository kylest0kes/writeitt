import React, { useState } from 'react';

import './CreateStoryModal.scss';

function CreateStoryModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    storyName: '',
    storySubTitle: '',
    storyDesc: '',
    storyImg: ''
  })

 const handleSetFormData = (e) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value
  })
 };

 const handleFormSubmit = async (e) => {
  e.preventDefault();
  console.log(`Form Data: ${formData.storyName}, ${formData.storySubTitle}, ${formData.storyDesc} `);
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
              A name and description help people understand what your story is all about.
            </p>
            <form onSubmit={handleFormSubmit} className="story-modal__form">
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
                  id="storySubTitle"
                  name="storySubTitle"
                  value={formData.storySubTitle}
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
              <div className="story-modal__image-upload">
                Image upload area (to be implemented)
              </div>
              <button type="submit" className="story-modal__submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateStoryModal
