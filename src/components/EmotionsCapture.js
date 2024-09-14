import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const EmotionCapture = () => {
  const [emotion, setEmotion] = useState(null);
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef(null);

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    return imageSrc;
  }, [webcamRef]);

  const handleCapture = async () => {
    setLoading(true);
    const imageSrc = captureImage();

    try {
      const formData = new FormData();
      formData.append('image', dataURItoBlob(imageSrc));

      const token = localStorage.getItem('access_token');
      const response = await axios.post('http://localhost:5000/api/emotion-capture', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setEmotion(response.data.emotion);
    } catch (error) {
      console.error('Error capturing emotion:', error);
    } finally {
      setLoading(false);
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="container mx-auto py-10 text-center">
      <h2 className="text-3xl font-bold mb-5">Capture Your Emotion</h2>

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded-lg border"
      />

      <button
        onClick={handleCapture}
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Capture Emotion'}
      </button>

      {emotion && (
        <div className="mt-6">
          <h3 className="text-xl">Predicted Emotion: <span className="font-bold text-blue-500">{emotion}</span></h3>
        </div>
      )}
    </div>
  );
};

export default EmotionCapture;
