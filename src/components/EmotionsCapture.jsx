import React, { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';

const EmotionCapture = () => {
  const navigate = useNavigate();
  const [emotion, setEmotion] = useState(null);         
  const [faceImage, setFaceImage] = useState(null);     
  const [loading, setLoading] = useState(false);        
  const [rating, setRating] = useState(0);              
  const [hover, setHover] = useState(null);             
  const [confirmedRating, setConfirmedRating] = useState(null);
  const webcamRef = useRef(null);                       

  // Capture image from webcam
  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    return imageSrc;
  }, [webcamRef]);

  // Convert dataURI to Blob (needed for file upload)
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

  // Handle capturing the image and sending it to the backend
  const handleCapture = async () => {
    setLoading(true);
    setEmotion(null);     
    setFaceImage(null); 

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

      // If there's an emotion prediction, display it and the grayscale face
      if (response.data.emotion) {
        setEmotion(response.data.emotion);
        setFaceImage(`data:image/jpeg;base64,${response.data.face_image}`);
      } 
      else if (response.data.error === 'No face detected') {
        setEmotion('No face detected');
      }
    } catch (error) {
      console.error('Error capturing emotion:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle submitting the rating
  const handleConfirmAccuracy = () => {
    setConfirmedRating(rating);
    // You can send the rating to the backend here if needed
    console.log(`Emotion: ${emotion}, Rating: ${rating}`);
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Smart Home System</h1>
          <div>
            <Link to="/home" className="text-gray-600 mx-4">Home</Link>
            <Link to="/profile" className="text-gray-600 mx-4">Profile</Link>
            <Link to="/settings" className="text-gray-600 mx-4">Settings</Link>
            <Link to="/emotions-capture" className="text-gray-600 mx-4">Emotions Capture</Link>
            <Link to="/about-us" className="text-gray-600 mx-4">About Us</Link>
            <Link to="/contact-us" className="text-gray-600 mx-4">Contact Us</Link>
            <button onClick={handleLogout} className="text-red-500 mx-4">Logout</button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-10">
        <h2 className="text-3xl font-bold mb-5 text-center">Capture Your Emotion</h2>
        <div className="flex justify-between">
          {/* Left Side: Webcam and Capture Button */}
          <div className="w-1/2">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded-lg border w-full"
            />
            <button
              onClick={handleCapture}
              className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-blue-600 w-full"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Capture Emotion'}
            </button>
          </div>

          {/* Right Side: Predicted Emotion, Image, and Rating */}
          <div className="w-1/2 pl-10">
            {/* Display predicted emotion */}
            {emotion && (
              <div className="mt-6">
                <h3 className="text-xl mb-2">
                  Predicted Emotion: <span className="font-bold text-blue-500">{emotion}</span>
                </h3>
              </div>
            )}

            {/* Display grayscale cropped face image */}
            {faceImage && (
              <div className="mt-4">
                <h3 className="text-xl mb-2">Grayscale Cropped Face Preview:</h3>
                <img src={faceImage} alt="Grayscale Cropped Face" className="rounded-lg border" />
              </div>
            )}

            {/* Star rating for accuracy
            <div className="mt-6">
              <h3 className="text-xl mb-2">Rate Emotion Accuracy:</h3>
              <div className="flex">
                {[...Array(10)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <label key={index}>
                      <input
                        type="radio"
                        name="rating"
                        value={ratingValue}
                        className="hidden"
                        onClick={() => setRating(ratingValue)}
                      />
                      <FaStar
                        size={30}
                        className="cursor-pointer"
                        color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(null)}
                      />
                    </label>
                  );
                })}
              </div>
              <button
                onClick={handleConfirmAccuracy}
                className="bg-green-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-green-600"
                disabled={confirmedRating !== null}
              >
                Confirm Accuracy
              </button>
            </div> */}

            {/* Show the confirmation result */}
            {/* {confirmedRating && (
              <div className="mt-4 text-green-500">
                <p>You rated the accuracy as {confirmedRating} out of 10.</p>
              </div>
            )} */}
          </div>
        </div>

        {/* Coming soon section */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-center">According to your emotion right now, below things will change</h3>
          <div className="flex justify-center mt-6">
            <div className="bg-gray-300 text-gray-700 p-10 rounded-lg shadow-lg">
              <h3 className="text-3xl font-bold">Coming Soon</h3>
              <p className="mt-4">Smart home features based on your emotions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionCapture;
