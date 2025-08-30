import React, { useEffect, useState } from 'react';

const AdminStoriesPage = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<string>('');

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/uploads/stories/stories.json');
        const data = await response.json();
        console.log('Fetched stories:', data);
        setStories(data.items);  // اصلاح دسترسی به items
      } catch (err) {
        console.error('Error fetching stories:', err);
      }
    };

    fetchStories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      fetch('/api/admin/stories', {
        method: 'POST',
        headers: {
          'x-admin-key': process.env.ADMIN_KEY || '', // وارد کردن کلید خود
        },
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('New story uploaded:', data);
          if (data.url) {
            setStories((prevStories) => [
              ...prevStories,
              { id: Date.now().toString(), url: data.url, createdAt: new Date().toISOString() },
            ]);
          }
        })
        .catch((err) => console.error('Error uploading story:', err));
    }
  };

  const openPopup = (storyUrl: string) => {
    setSelectedStory(storyUrl);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedStory('');
  };

  return (
    <div>
      <h1>Admin Stories Page</h1>
      <div>
        <h2>Upload New Story</h2>
        <input type="file" onChange={handleFileChange} />
      </div>
      <div>
        <h2>Existing Stories</h2>
        <ul>
          {stories.length > 0 ? (
            stories.map((story) => (
              <li key={story.id} style={{ marginBottom: '10px' }}>
                <img
                  src={story.url}
                  alt="story"
                  style={{ width: '100px', cursor: 'pointer' }}
                  onClick={() => openPopup(story.url)}  // کلیک برای باز کردن پاپ‌آپ
                />
                <p>Created At: {new Date(story.createdAt).toLocaleString()}</p>
              </li>
            ))
          ) : (
            <p>No stories available</p>
          )}
        </ul>
      </div>

      {/* پاپ‌آپ نمایش استوری */}
      {isPopupOpen && (
        <div style={popupStyles.overlay}>
          <div style={popupStyles.popup}>
            <img src={selectedStory} alt="Selected Story" style={popupStyles.image} />
            <button onClick={closePopup} style={popupStyles.closeButton}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

// استایل‌های پاپ‌آپ
const popupStyles = {
  overlay: {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: 'white',
    padding: '20px',
    textAlign: 'center' as 'center',
    position: 'relative' as 'relative',
  },
  image: {
    maxWidth: '80%',
    maxHeight: '80vh',
  },
  closeButton: {
    position: 'absolute' as 'absolute',
    top: '10px',
    right: '10px',
    padding: '5px 10px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default AdminStoriesPage;
