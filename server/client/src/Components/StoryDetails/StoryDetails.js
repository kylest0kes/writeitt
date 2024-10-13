import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Post from '../Post/Post.js';
import './StoryDetails.scss';

const StoryDetails = () => {
    const { slug } = useParams();
    const [story, setStory] = useState(null);
    const [error, setError] = useState(null);

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

    return (
        <div className="story-details">
            <div className="header">
                <div className="icon-placeholder"></div>
            </div>
            <div className="sub-header">
                <div className="name-and-subtitle">
                    <h1>{story.name}</h1>
                    <p>{story.subtitle}</p>
                </div>
                <div className="buttons">
                    <button className="create-post">+ Create Post</button>
                    <button className="join">Join</button>
                    {/* <button className="more">•••</button> */}
                </div>
            </div>
            <div className="story-content">
                <p>{story.description}</p>
                <Post />
            </div>
        </div>
    )
}

export default StoryDetails;
