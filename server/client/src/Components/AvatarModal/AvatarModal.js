import React from "react";

import "./AvatarModal.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";

function AvatarModal({ onClose }) {
  return (
    <div id="avatar-wrapper">
      <form action="#" method="post">
        <h1 className="avatar-heading">Change Avatar</h1>

        <div className="avatar-input-container">
          <div className="avatar-input-wrapper">
            <div className="avatar-upload">
              <div className="avatar-edit">
                <input
                  type="file"
                  id="imageUpload"
                  accept=".png, .jpg, .jpeg"
                  className="avatar-input"
                />
                <label for="imageUpload" className="upload-icon-label">
                  <FontAwesomeIcon icon={faCloudArrowUp} />
                </label>
              </div>
              <div className="avatar-preview">
                <div
                  id="imagePreview"
                  style={{
                    backgroundImage: "url(https://via.placeholder.com/350x350)",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="avatar-btns-container">
          <button
            className="avatar-cancel-btn"
            type="submit"
            onClick={() => onClose()}
          >
            Cancel
          </button>
          <button className="avatar-submit-btn" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default AvatarModal;
