import React, { useState } from 'react';
import './ReviewForm.css';
import { Link } from 'react-router-dom';

function ReviewForm({ restaurantId, fetchRestaurant, loggedInUser }) {
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [reviewRating, setReviewRating] = useState('');

  const [isShown, setIsShown] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    if (!reviewRating) {
      setErrorMessage('Please select a valid rating.');
      return; // Prevent submission if rating isn't selected
    }
    // console.log(loggedInUser)
    const newReview = {
      title: reviewTitle,
      body: reviewBody,
      rating: parseInt(reviewRating),
      restaurant_id: restaurantId,
      user_id: loggedInUser.id,
    };

    fetch(`/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newReview),
    })
      .then((response) => response.json())
      .then((data) => {
        fetchRestaurant();
        console.log(data);
        restaurantId;
        setReviewTitle('');
        setReviewBody('');
        setReviewRating(0);
        setIsShown(false);
        setErrorMessage('');
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMessage('Failed to submit review. Please try again.');
      });
  };

  const handleShow = () => {
    setIsShown(!isShown);
    setErrorMessage(''); // Clear error message when re-showing the form
  };

  return (
    <div className={`form-container ${isShown ? 'expanded' : ''}`}>
      {loggedInUser ? (
        <button className="show" onClick={handleShow}>
          Write a review
        </button>
      ) : (
        <Link to="/signup" className="signup-link">
          Login or Sign Up to Post a Review
        </Link>
      )}
      {isShown && (
        <form className="form" onSubmit={handleReviewSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Review Title"
            className="title-text"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
          />
          <textarea
            name="body"
            placeholder="Write your review here"
            className="body-text"
            value={reviewBody}
            onChange={(e) => setReviewBody(e.target.value)}
          />
          <select
            name="rating"
            className="review-rating"
            value={reviewRating}
            onChange={(e) => setReviewRating(e.target.value)}
          >
            <option value="" disabled>
              Select rating
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <button type="submit" className="submit-button">
            Post Review
          </button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      )}
    </div>
  );
}

export default ReviewForm;
