import React from 'react';
import Image from 'next/image';

const StoriesRow = ({ stories }: { stories: any[] }) => {
  return (
    <div className="stories-row">
      {stories.length > 0 ? (
        stories.map((story) => (
          <div key={story.id} className="story-item">
            <div className="w-16 h-16 rounded-full border-2 border-pink-500 overflow-hidden">
              <Image
                src={story.src || "/uploads/stories/default-image.jpg"}  // تصویر پیش‌فرض
                alt={story.label || "Story Image"}  // متن پیش‌فرض
                width={64}
                height={64}
              />
            </div>
            <p>{story.label || "No Label"}</p>
          </div>
        ))
      ) : (
        <p>No stories available</p>
      )}
    </div>
  );
};

export default StoriesRow;
