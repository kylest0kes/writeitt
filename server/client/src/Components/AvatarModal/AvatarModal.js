import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AvatarModal.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../Contexts/UserContext";
import { useAuth } from "../../Contexts/AuthContext";

function AvatarModal({ onClose }) {
    const [imagePreview, setImagePreview] = useState(null);
    const [userImg, setUserImg] = useState(null);
    const [csrfToken, setCsrfToken] = useState("");

    const { user, setUser } = useUser();
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchCsrfToken = async () => {
        const { data } = await axios.get("/api/csrf-token");
            setCsrfToken(data.csrfToken);
        };
        fetchCsrfToken();
    }, []);

    useEffect(() => {
        if (user && user.userImg) {
            setImagePreview(user.userImg);
        }
    }, [user])

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUserImg(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarModalSubmit = async (e) => {
        e.preventDefault();

        if (!userImg) {
            return;
        }

        const formData = new FormData();
        formData.append("avatar", userImg);

        try {
            const res = await axios.put('api/users/update-avatar', formData, {
                headers: {
                    'csrf-token': csrfToken,
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.user && res.data.user.userImg) {
                setUser(res.data.user);
                setImagePreview(res.data.user.userImg);
            }

            onClose();

        } catch (err) {
            console.error('Error updating image', err);
        }
    };

    return (
        <div id="avatar-wrapper">
            <form method="post" onSubmit={handleAvatarModalSubmit}>
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
                        onChange={handleImageChange}
                        />
                        <label htmlFor="imageUpload" className="upload-icon-label">
                        <FontAwesomeIcon icon={faCloudArrowUp} />
                        </label>
                    </div>
                    <div className="avatar-preview">
                        <div id="imagePreview" style={{
                        backgroundImage: `url(${imagePreview})`,
                    }}></div>
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
