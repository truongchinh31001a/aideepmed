export const submitReport = async (profileId, imageId, comment, token) => {
    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Truyền JWT vào header
        },
        body: JSON.stringify({
          profileId,
          imageId,
          comment,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return { success: true, message: 'Report submitted successfully' };
      } else {
        return { success: false, message: data.message || 'Failed to submit the report' };
      }
    } catch (error) {
      return { success: false, message: 'An error occurred while submitting the report' };
    }
  };
  