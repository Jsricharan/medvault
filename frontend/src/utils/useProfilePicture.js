import { useState, useEffect } from 'react';
import { getProfilePicFromStorage } from '../services/profileService';

// Custom hook - gets profile picture for CURRENT user only
function useProfilePicture() {

  const [profilePicture, setProfilePicture] = useState(
    getProfilePicFromStorage()
  );

  useEffect(() => {
    // Update when user changes or picture updates
    setProfilePicture(getProfilePicFromStorage());

    const handleUpdate = () => {
      setProfilePicture(getProfilePicFromStorage());
    };

    window.addEventListener(
      'profilePictureUpdated',
      handleUpdate
    );

    // Also listen for storage changes
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(
        'profilePictureUpdated',
        handleUpdate
      );
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return profilePicture;
}

export default useProfilePicture;