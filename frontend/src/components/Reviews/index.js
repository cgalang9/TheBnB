import { getAllReviewsThunk } from '../../store/reviews'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

function Reviews() {
    const { spotId } = useParams()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllReviewsThunk(spotId))
    }, [dispatch])

    const reviews = useSelector(state => state.reviews.Reviews)

    return (
        <>
            {reviews && (reviews.map(review => (
                <div key={review.id}>
                    <div>==========================</div>
                    <div>{review.User.firstName}</div>
                    <div>{new Date(review.createdAt).toLocaleString('default', {month: 'long', year: 'numeric'})}</div>
                    <div>{review.review}</div>
                </div>
            )))}
        </>
    )
}

export default Reviews
