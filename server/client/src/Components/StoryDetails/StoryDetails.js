import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Post from '../Post/Post.js';
import './StoryDetails.scss';
import { useUser } from '../../Contexts/UserContext';
import { useAuth } from '../../Contexts/AuthContext';
import EditStoryMenu from '../EditStoryMenu/EditStoryMenu.js';
import JoinButton from '../JoinButton/JoinButton.js';

const StoryDetails = () => {
    const { slug } = useParams();
    const [story, setStory] = useState(null);
    const [error, setError] = useState(null);
    const [isJoined, setIsJoined] = useState(false);
    const [isEditStoryMenuVisible, setIsEditStoryMenuVisible] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const [csrfToken, setCsrfToken] = useState('');
    const { user, setUser } = useUser();
    const { authToken } = useAuth();

    const editStoryMenuRef = useRef(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        }
    }, []);

    useEffect(() => {
        const fetchCsrfToken = async () => {
            const { data } = await axios.get('/api/csrf-token')
            setCsrfToken(data.csrfToken);
        };
        fetchCsrfToken();
    }, []);

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const res = await axios.get(`/api/stories/story/${slug}`);
                setStory(res.data);

                if (user && res.data.subscribers.includes(user._id)) {
                    setIsJoined(true);
                }

                setIsCreator(user && res.data.creator && res.data.creator._id === user._id);

            } catch (err) {
                setError('Error fetching story');
                console.error(err);
            }
        }
        fetchStory();
    }, [slug, user]);

      const handleStoryUpdate = useCallback((updatedStory) => {
        setStory(updatedStory);
        setUser((prevUser) => ({
            ...prevUser,
            following: prevUser.following.map((id) =>
                id.toString() === updatedStory._id.toString() ? updatedStory._id : id
            ),
        }));
        setIsEditStoryMenuVisible(false);
    }, [setUser]);

    const handleOutsideClick = (e) => {
        const modalElements = document.querySelectorAll('.modal, .delete-story-modal-wrapper, .edit-story-modal-wrapper');
        const isClickInsideModal = Array.from(modalElements).some(element =>
            element && element.contains(e.target)
        );

        if (
            editStoryMenuRef.current &&
            !editStoryMenuRef.current.contains(e.target) && !isClickInsideModal
        ) {
            setIsEditStoryMenuVisible(false);
        }
    }

    const toggleEditStoryMenu = (e) => {
        e.stopPropagation();
        setIsEditStoryMenuVisible((prev) => !prev);
    }

    const handleJoinToggle = (updatedData) => {
        setStory(prev => ({
            ...prev,
            subscribers: updatedData.subscribers,
            subscriberCount: updatedData.subscriberCount
        }));
        setUser(updatedData.user);
    };

    if (error) {
        return <p style={{color: 'red'}}>{error}</p>
    }

    if (!story) {
        return <div className="spinner"></div>;
    }

    return (
        <div className="story-details">
            <div className="header" style={{ backgroundImage: `url(${story.bannerImg})` }}>
                <div className="icon-placeholder" style={{ backgroundImage: `url(${story.img})` }}></div>
            </div>
            <div className="sub-header">
                <div className="name-and-subtitle">
                    <h1>{story.name}</h1>
                    <p>{story.subtitle}</p>
                </div>
                <div className="buttons">
                    <button className="create-post">+ Create Post</button>
                    <JoinButton
                        isJoined={isJoined}
                        setIsJoined={setIsJoined}
                        slug={slug}
                        csrfToken={csrfToken}
                        authToken={authToken}
                        setUser={setUser}/>
                    {isCreator && authToken && (
                        <div className="edit-menu-container" ref={editStoryMenuRef}>
                            <button
                                className="more"
                                onClick={toggleEditStoryMenu}>
                                •••
                            </button>
                            {isEditStoryMenuVisible && (<EditStoryMenu story={story} ref={editStoryMenuRef} onStoryUpdate={handleStoryUpdate} />)}
                        </div>
                    )}
                </div>
            </div>
            <div className="story-content">
                <h4>About: </h4>
                <p>{story.description}</p>
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
           </div>
        </div>
    )
}

export default StoryDetails;
