import React, { useEffect } from "react";
import { useModal } from "../../context/Modal";
import { useSelector, useDispatch } from 'react-redux';
import * as commentsthunk from "../../store/comment"
import { useState } from "react";

function CommentModal({ origincomment }) {
    console.log("In the comment modal what i got the name i passed in: ", origincomment)
    const dispatch = useDispatch()
    const { closeModal } = useModal()
    const [comment, setComment] = useState(origincomment.comment)
    const [errors, setErrors] = useState([])


    // validation for gupdated comment
    useEffect(() => {
        let e = []
        if (comment.length === 0) e.push("updated comment can't be empty")
        setErrors(e)
    }, [comment])


    const handleSubmit = (e) => {
        e.preventDefault()
        let payload = { 'id': origincomment.id, 'comment': comment }
        console.log("check typeof payload: ", payload)
        dispatch(commentsthunk.updateComments(payload)).then(closeModal)
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="modal-group">
                <div className="width-350px height-350px">
                    <header className="bg-5cc5a7">Update your comment</header>
                    <div>
                        <div id="error">
                            {errors.length > 0 ? (errors.map(error => <div>{error}</div>)) : <div></div>}
                        </div>
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={errors.length > 0}>Yes</button>
                    <button onClick={closeModal}>No</button>
                </div>
            </form>
        </>
    )
}


export default CommentModal;
