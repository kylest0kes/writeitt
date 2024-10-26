import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Post from '../Post/Post.js';
import './StoryDetails.scss';
import { useUser } from '../../Contexts/UserContext';
import { useAuth } from '../../Contexts/AuthContext';
import EditStoryMenu from '../EditStoryMenu/EditStoryMenu.js';

const StoryDetails = () => {
    const { slug } = useParams();
    const [story, setStory] = useState(null);
    const [error, setError] = useState(null);
    const [isJoined, setIsJoined] = useState(false);
    const [isEditStoryMenuVisible, setIsEditStoryMenuVisible] = useState(false);
    const [loading, setLoading] = useState(false);
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

            } catch (err) {
                setError('Error fetching story');
                console.error(err);
            }
        }
        fetchStory();
    }, [slug, user]);

    const handleOutsideClick = (e) => {
        if (
            editStoryMenuRef.current &&
            !editStoryMenuRef.current.contains(e.target)
        ) {
            setIsEditStoryMenuVisible(false);
        }
    }

    const toggleEditStoryMenu = (e) => {
        e.stopPropagation();
        setIsEditStoryMenuVisible((prev) => !prev);
    }

    const handleJoinClick = async () => {
        if (!user || !authToken) {
            setError('Please log in or create an account to join Stories.');
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(`/api/users/follow-story/${slug}`,
                {},
                {
                    headers: {
                        'csrf-token': csrfToken,
                        'Authorization': `Bearer ${authToken}`
                    }
                }
            );

            setIsJoined(!isJoined);

            setStory(prev => ({
                ...prev,
                subscribers: res.data.subscribers,
                subscriberCount: res.data.subscriberCount
            }));

            setUser(res.data.user);

        } catch (err) {
            setError(err.response?.data?.message || "Error encountered while attempting to join Story.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (error) {
        return <p style={{color: 'red'}}>{error}</p>
    }

    if (!story) {
        return <div className="spinner"></div>;
    }

    const isCreator = user && story.creator && story.creator._id === user._id;

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
                    <button
                        className={`join ${isJoined ? 'joined' : ''}`}
                        onClick={handleJoinClick}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : isJoined ? 'Joined' : 'Join'}
                    </button>
                    {isCreator && authToken && (
                        <div className="edit-menu-container" ref={editStoryMenuRef}>
                            <button className="more" onClick={toggleEditStoryMenu}>•••</button>
                            {isEditStoryMenuVisible && <EditStoryMenu  />}
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
