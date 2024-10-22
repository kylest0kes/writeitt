import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Post from '../Post/Post.js';
import './StoryDetails.scss';
import { useUser } from '../../Contexts/UserContext';
import { useAuth } from '../../Contexts/AuthContext';

const StoryDetails = () => {
    const { slug } = useParams();
    const [story, setStory] = useState(null);
    const [error, setError] = useState(null);
    const { user } = useUser();
    const { authToken } = useAuth();

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const res = await axios.get(`/api/stories/story/${slug}`);
                setStory(res.data);

            } catch (err) {
                setError('Error fetching story');
                console.error(err);
            }
        }
        fetchStory();
    }, [slug]);

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
                    <button className="join">Join</button>
                    {isCreator && authToken ? (
                        <button className="more">•••</button>
                    ) : null }
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
