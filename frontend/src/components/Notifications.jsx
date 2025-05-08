import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notifications = ({ userEmail }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/notifications?email=${userEmail}`);
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
  }, [userEmail]);

  return (
    <div>
      <h3>Notifications</h3>
      {notifications.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        <ul>
          {notifications.map((note, index) => (
            <li key={index}>
              {note.message} <br />
              <small>{new Date(note.date).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
