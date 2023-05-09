import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as expensesthunk from "../../store/expense"
import * as commentsthunk from "../../store/comment"
import ExpenseModal from "../ExpenseModal"
import EditExpense from "../EditExpense"
import DeleteConfirmationModal from "../DeleteConfirmationModal"
import OpenModalButton from "../OpenModalButton";

function ExpenseDetail({ exp, setShowDetail, allCommentsArr }) {
    console.log("exp detail here: ", exp, allCommentsArr)
    // console.log("ExpenseDetail with passed currentid: ", typeof currentId, currentId, setShowDetail)
    // const allComments = useSelector((state) => state.comments.allComments)
    const dispatch = useDispatch()
    const [comment, setComment] = useState("");
    const expenseId = exp.id

    //create comment handler
    function createCommentHandler() {
        let payload = { comment, expenseId }
        console.log("create comment payload: ", payload)
        dispatch(commentsthunk.createComments(payload))
        dispatch(commentsthunk.allComments(expenseId))

    }


    // //delete comment handler
    // function deleteCommentHandler(comment) {
    //     console.log("delete comment handler with passed in comment: ", comment)
    //     let commentId = comment.id

    //     console.log("delete comment handler with passed in comment2: ", commentId)
    //     dispatch(commentsthunk.deleteComments(commentId))

    //     // dispatch(commentsthunk.deleteComments(comment))
    // }

    // if (!aExpanse) return null
    if (!exp) return null

    // if allcomment passed in with undefined
    if (allCommentsArr === undefined) return null

    return (
        <>
            <div>
                <div className="height-50">
                    <h3 id="description">{exp.name}</h3>
                    <div >${exp.expense_total}</div>
                    <div className="detail">

                        <OpenModalButton
                            buttonText="Edit expense"
                            modalComponent={<EditExpense expenseinfo={exp} setShowDetail={setShowDetail} />}
                        />
                    </div>
                </div>


                <div className=" height-50 border-bottom-main flx">
                    <div className="width-50">Who's in the group (coming soon)</div>
                    {/* <div className="width-50 height-100">ppl involved</div> */}
                    {/* <div className="width-50 height-100">comments</div> */}
                    <div className="comment width-100">
                        <div >
                            {allCommentsArr.map(comment =>
                                <div>
                                    <div className="flx">
                                        {comment.user ? <div className="font-weight">{comment.user.username}</div> : <div></div>}
                                        <div className="margin-30px-auto btn-add float-r btn">
                                            <OpenModalButton
                                                buttonText={<i class="fas fa-times"></i>}
                                                modalComponent={<DeleteConfirmationModal type="delete comment" commentid={comment.id} />}
                                            />
                                            {/* <i class="fas fa-times"></i> */}
                                        </div>
                                    </div>

                                    <div className="flx">
                                        <div>{comment.comment}</div>
                                    </div>

                                </div>)}
                        </div>
                        <div className="flx-col font-grey">
                            <i class="fa-solid fa-messages "></i>
                            NOTES AND COMMENTS
                            <label>
                                <textarea placeholder="Add a comment" rows="2" value={comment} onChange={(e) => setComment(e.target.value)}></textarea>
                            </label>
                        </div>
                        <button className=" width-50" onClick={createCommentHandler}>Post</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ExpenseDetail;
