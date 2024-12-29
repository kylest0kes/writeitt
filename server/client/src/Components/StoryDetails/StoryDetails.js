import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Post from '../Post/Post.js';
import './StoryDetails.scss';
import { useUser } from '../../Contexts/UserContext';
import { useAuth } from '../../Contexts/AuthContext';
import EditStoryMenu from '../EditStoryMenu/EditStoryMenu.js';
import JoinButton from '../JoinButton/JoinButton.js';
import StoryStats from '../StoryStats/StoryStats.js';
import Modal from '../Modal/Modal.js';
import CreatePostModal from '../CreatePostModal/CreatePostModal.js';

const StoryDetails = () => {
    const { slug } = useParams();
    const [story, setStory] = useState(null);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [isJoined, setIsJoined] = useState(false);
    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
    const [isEditStoryMenuVisible, setIsEditStoryMenuVisible] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const [csrfToken, setCsrfToken] = useState('');
    const { user, setUser } = useUser();
    const { authToken } = useAuth();

    const openCreatePostModal = () => setIsCreatePostModalOpen(true);
    const closeCreatePostModal = () => setIsCreatePostModalOpen(false);

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

    useEffect(() => {
        const fetchPosts = async () => {
            if (story) {
                try {
                    const res = await axios.get(`/api/posts/get-story-posts/${story._id}`);
                    setPosts(res.data);
                } catch (err) {
                    setError('Error fetching posts');
                    console.error(err)
                }
            }
        }
        fetchPosts();
    }, [story]);

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

    const handlePostsUpdate = useCallback((newPost) => {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
        setStory((prevStory) => ({
            ...prevStory,
            postCount: prevStory.postCount + 1
        }));
    }, [])

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
                    <button className="create-post" onClick={openCreatePostModal}>+ Create Post</button>
                    <Modal isOpen={isCreatePostModalOpen} onClose={closeCreatePostModal}>
                        <CreatePostModal onClose={closeCreatePostModal} storyId={story._id} onPostCreated={handlePostsUpdate}/>
                    </Modal>
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
                <div className='story-content-info'>
                    <div className='story-content-info-left'>
                        <h4 className='about-story'>About: </h4>
                        <p>{story.description}</p>
                    </div>
                    <div className='story-content-info-right'>
                        <StoryStats story={story}/>
                    </div>
                </div>
                <div className="story-content-posts">
                    { posts.length > 0 ? (
                        posts.map((post) => <Post key={post._id} post={post} storySlug={slug} type="storydetail" />)
                    ) : (
                        <p>No posts available.</p>
                    )}
                </div>
           </div>
        </div>
    )
}

export default StoryDetails;
