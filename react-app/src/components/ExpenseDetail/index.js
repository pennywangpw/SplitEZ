import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as expensesthunk from "../../store/expense"
import * as commentsthunk from "../../store/comment"
import CommentModal from "../CommentModal"
import EditExpense from "../EditExpense"
import DeleteConfirmationModal from "../DeleteConfirmationModal"
import OpenModalButton from "../OpenModalButton";

function ExpenseDetail({ exp, setShowDetail, allCommentsArr }) {
    console.log("exp detail here: ", setShowDetail, exp, allCommentsArr)
    const singleExpense = useSelector((state) => state.expenses.singleExpense);
    const dispatch = useDispatch()
    const [comment, setComment] = useState("");
    const expenseId = exp.id


    //create comment handler
    function createCommentHandler() {
        let payload = { comment, expenseId }
        console.log("create comment payload: ", payload)
        dispatch(commentsthunk.createComments(payload))
        dispatch(commentsthunk.allComments(expenseId))
        setComment("")
    }


    let divided_amount;
    let involved_user = [];
    if (Object.keys(singleExpense).length !== 0) {
        //caculate divide amount
        if (singleExpense.associateduser.length > 0) {
            divided_amount = singleExpense.expense_total / singleExpense.associateduser.length
        } else {
            divided_amount = singleExpense.expense_total
        }

        // users(friends) who involve in this expense and make sure the user only appears once not duplicated
        if (singleExpense.associateduser.length > 0) {
            singleExpense.associateduser.forEach(user => {
                if (user.id !== singleExpense.billpayer.id) {
                    involved_user.push(user.username)
                }
            })
        }

    }


    // if (!aExpanse) return null
    if (!exp) return null

    // if allcomment passed in with undefined
    if (allCommentsArr === undefined) return null

    return (
        <>
            <div>
                <div className="height-50">
                    <h3 id="description">{exp.name}</h3>
                    <div >${Number(exp.expense_total).toFixed(2)}</div>
                    <div className="detail">

                        <OpenModalButton
                            className={"button-orange"}
                            buttonText="Edit expense"
                            modalComponent={<EditExpense expenseinfo={exp} setShowDetail={setShowDetail} />}
                        />
                    </div>
                </div>


                <div className=" height-50 border-bottom-main flx">
                    <div className="width-50">
                        <div>Who involes in this expense: </div>
                        {singleExpense.billpayer ? (<div>{`${singleExpense.billpayer.username} paid $${singleExpense.expense_total} and owes $${divided_amount.toFixed(2)}`}</div>) : (<div></div>)}
                        {involved_user.map(user => <div>{`${user} owes $${divided_amount.toFixed(2)}`}</div>)}
                    </div>
                    {/* <div className="width-50 height-100">ppl involved</div> */}
                    {/* <div className="width-50 height-100">comments</div> */}
                    <div className="comment width-100">
                        <div >
                            {allCommentsArr.map(comment =>
                                <div>
                                    <div className="flx">
                                        {comment.user ? <div className="font-weight">{comment.user.username}</div> : <div></div>}
                                        <div className="margin-30px-auto float-r">
                                            <OpenModalButton
                                                buttonText={<i class="fas fa-edit"></i>}
                                                className={"button"}
                                                modalComponent={<CommentModal origincomment={comment} />}

                                            // modalComponent={<DeleteConfirmationModal type="delete comment" commentid={comment.id} expenseId={expenseId} />}
                                            />
                                            <OpenModalButton
                                                buttonText={<i class="fas fa-times"></i>}
                                                className={"button"}
                                                modalComponent={<DeleteConfirmationModal type="delete comment" commentid={comment.id} expenseId={expenseId} />}
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
                        <button className=" width-50 button-orange" onClick={createCommentHandler} disabled={comment.length === 0}>Post</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ExpenseDetail;
