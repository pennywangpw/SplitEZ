import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as expensesthunk from "../../store/expense"
import * as commentsthunk from "../../store/comment"

import OpenModalButton from "../OpenModalButton";
import ExpenseModal from "../ExpenseModal"
import EditExpense from "../EditExpense"


function ExpenseDetail({ exp, setShowDetail, allCommentsArr }) {
    console.log("exp detail here: ", exp)
    // console.log("ExpenseDetail with passed currentid: ", typeof currentId, currentId, setShowDetail)
    // const allComments = useSelector((state) => state.comments.allComments)
    const dispatch = useDispatch()

    const expenseId = exp.id

    // console.log("ExpenseDetail try to get a allComments: ", expenseId, allComments)
    // const allCommentsArr = Object.values(allComments)
    // console.log("ExpenseDetail convert into array: ", allCommentsArr)

    // useEffect(() => {
    //     dispatch(commentsthunk.allComments(expenseId))
    //     return () => dispatch(commentsthunk.clearCommentA())

    // }, [dispatch, expenseId])


    //alert function for comment button
    function handleAlert() {
        dispatch(commentsthunk.createComments(expenseId))

    }

    // if (!aExpanse) return null
    if (!exp) return null

    // if (allCommentsArr.length === 0) return null

    return (
        <>
            <div className="height-350px">
                <div className="height-50">
                    <div id="description">{exp.name}</div>
                    <div id="description">${exp.expense_total}</div>
                    <div className="detail">

                        <OpenModalButton
                            buttonText="Edit expense"
                            modalComponent={<EditExpense expenseinfo={exp} setShowDetail={setShowDetail} />}
                        />
                    </div>
                </div>


                <div className=" height-50 flx">
                    <div className="width-50">Who's in the group (coming soon)</div>
                    {/* <div className="width-50 height-100">ppl involved</div> */}
                    {/* <div className="width-50 height-100">comments</div> */}
                    <div className="comment width-100">
                        <div className=" width-50">
                            {allCommentsArr.map(comment => <div>{comment.comment}</div>)}
                        </div>
                        <button className=" width-50" onClick={handleAlert}>comments</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ExpenseDetail;
