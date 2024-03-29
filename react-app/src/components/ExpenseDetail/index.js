import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as expensesthunk from "../../store/expense"
import * as commentsthunk from "../../store/comment"
import CommentModal from "../CommentModal"
import EditExpense from "../EditExpense"
import DeleteConfirmationModal from "../DeleteConfirmationModal"
import OpenModalButton from "../OpenModalButton";

function ExpenseDetail({ exp, setShowDetail, allCommentsArr, debtors_name }) {
    // console.log("exp detail here: ", setShowDetail, exp, allCommentsArr, debtors_name)
    const allUsers = useSelector((state) => state.users.allusers)
    let allUsersArr = Object.values(allUsers)
    const singleExpense = useSelector((state) => state.expenses.singleExpense);
    const dispatch = useDispatch()
    const [comment, setComment] = useState("");
    const expenseId = exp.id
    let billpayer_name;



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
        if (singleExpense.debtors.length > 0) {
            divided_amount = singleExpense.expense_total / singleExpense.debtors.length
        } else {
            divided_amount = singleExpense.expense_total
        }

        // users(friends) who involve in this expense and make sure the user only appears once not duplicated
        if (singleExpense.debtors.length > 0) {
            singleExpense.debtors.forEach(user => {
                if (user.id !== singleExpense.payer_user_id) {
                    involved_user.push(user.username)
                }
            })
        }

    }


    //find bill payer name when open expense details
    for (let friend of allUsersArr) {
        if (friend.id === singleExpense.payer_user_id) {
            billpayer_name = friend.username
            break
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
                        {debtors_name.includes(billpayer_name) ? (<div>{`${billpayer_name} paid $${singleExpense.expense_total} and owes $${divided_amount.toFixed(2)}`}</div>) : (<div>{`${billpayer_name} paid $${singleExpense.expense_total}`}</div>)}
                        {debtors_name.length > 0 ?
                            (debtors_name.map(username => {
                                if (username !== billpayer_name) {
                                    return <div>{`${username} owes $${divided_amount.toFixed(2)}`}</div>
                                }
                            }))
                            : (<div>no ppl involes</div>)
                        }

                    </div>
                    {/* <div className="width-50 height-100">ppl involved</div> */}
                    {/* <div className="width-50 height-100">comments</div> */}
                    <div className="comment width-50">
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
