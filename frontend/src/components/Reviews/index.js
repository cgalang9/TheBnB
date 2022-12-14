import { getAllReviewsThunk } from "../../store/currSpotReviews";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { NavLink, useHistory, useParams } from "react-router-dom";
import "./Reviews.css";

function Reviews() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(getAllReviewsThunk(spotId)).catch((res) => history.push("/404"));
  }, [dispatch, history, spotId]);

  const reviewsObj = useSelector((state) => state.currentSpotReviews);
  let reviews;
  if (reviewsObj) reviews = Object.values(reviewsObj);
  const sessionUser = useSelector((state) => state.session.user);
  let userHasReview = false;
  if (reviews && sessionUser) {
    reviews.forEach((review) => {
      if (sessionUser.id === review.userId) userHasReview = true;
    });
    reviews = reviews.slice(0, 6);
  }

  return (
    <>
      {sessionUser && !userHasReview && (
        <NavLink to={`/spots/${spotId}/reviews/new`}>
          Create A New Review
        </NavLink>
      )}
      <div className="reviews_list">
        {reviews &&
          reviews.map((review) => (
            <div key={review.id} className="reviews_list_item_container">
              <div className="reviews_list_item_head">
                <div style={{ fontSize: 30 }}>
                  <i className="fa-solid fa-circle-user" />
                </div>
                <div className="reviews_list_user_details">
                  <div className="reviews_list_username">
                    {review.User.firstName}
                  </div>
                  <div className="reviews_list_date">
                    {new Date(review.createdAt).toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div className="review_text">{review.review}</div>
            </div>
          ))}
      </div>
    </>
  );
}

export default Reviews;
