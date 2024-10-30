import React, { useState } from 'react';
import axios from 'axios';

const JoinButton = ({ isJoined, setIsJoined, slug, csrfToken, authToken, setUser }) => {
    const [loading, setLoading] = useState(false);

    const handleJoinClick = async () => {
        setLoading(true);

        setIsJoined(!isJoined);

        try {
            const res = await axios.post(`/api/users/follow-story/${slug}`, {}, {
                headers: {
                    'csrf-token': csrfToken,
                    'Authorization': `Bearer ${authToken}`
                }
            });

            setUser(res.data.user);
        } catch (err) {
            setIsJoined(isJoined);
            console.error("Error joining/unjoining story:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={`join ${isJoined ? 'joined' : ''}`}
            onClick={handleJoinClick}
            disabled={loading}
        >
            {loading ? 'Loading...' : isJoined ? 'Joined' : 'Join'}
        </button>
    );
};

export default JoinButton;
