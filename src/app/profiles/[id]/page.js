"use client";

import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { useParams } from 'next/navigation';

export default function ProfileDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to call API to fetch profile data based on ID
  const fetchProfileData = async () => {
    try {
      const response = await fetch(`/api/profiles/${id}`);
      const data = await response.json();
      setProfile(data.profile);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfileData();
    }
  }, [id]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (!profile) {
    return <p>No profile found.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <div className="flex-grow overflow-y-auto pt-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-6 mt-5">{profile.name}</h2> {/* Profile Title */}
        <div className="space-y-6">
          {profile.images.map((image, index) => {
            const title = image.thirdPartyInfo?.predictions?.[0]?.[0] || 'Unknown';
            return (
              <div 
                key={index} 
                className="flex flex-col md:flex-row items-center md:space-x-6 p-4 max-w-[900px] mx-auto"
              >
                <div className="w-36 h-36 flex-shrink-0 mb-4 md:mb-0">
                  <img
                    src={image.path}
                    alt={image.originalname}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-lg font-semibold capitalize">{title}</h3>
                  {image.thirdPartyInfo?.predictions?.[0]?.[1] && (
                    <p className="text-gray-600"><strong>Diagnosis:</strong> {image.thirdPartyInfo.predictions[0][1]}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
