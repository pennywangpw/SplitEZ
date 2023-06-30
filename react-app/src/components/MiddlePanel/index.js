import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import OpenModalButton from "../OpenModalButton";
import * as expensesthunk from "../../store/expense"
import * as commentsthunk from "../../store/comment"
import DeleteConfirmationModal from "../DeleteConfirmationModal"
import CreateExpense from "../CreateExpense"
import ExpenseDetail from "../ExpenseDetail"


function ExpensesList() {
    const [showDetail, setShowDetail] = useState(false)
    const [currentId, setCurrentId] = useState(1)
    const dispatch = useDispatch();
    const allExpenses = useSelector((state) => state.expenses.allExpenses);
    const allGroups = useSelector((state) => state.groups.allGroups);
    const currentuser = useSelector((state) => state.session.user);
    const allComments = useSelector((state) => state.comments.allComments)

    //get group id from allGroups
    let allGroupsArr = Object.values(allGroups)
    let allGroupsIdArr = []
    for (let group of allGroupsArr) {
        allGroupsIdArr.push(group.id)
    }

    useEffect(() => {
        dispatch(expensesthunk.allExpenses())
        return () => dispatch(expensesthunk.clearExpensesA())
    }, [dispatch])



    const singleExpensehandler = (id) => {
        dispatch(expensesthunk.singleExpense(id))
    }

    //when the user click the expense summary fetch backend to get allcomments under the clicked expenseid
    const loadCommentshandler = (id) => {
        dispatch(commentsthunk.allComments(id))
        dispatch(commentsthunk.clearCommentA())
    }

    //convert allcomments into array
    const allCommentsArr = Object.values(allComments)

    //change the order of allExpensesinArr by descending
    let allExpensesinArr;
    if (Object.values(allExpenses).length > 0) {
        allExpensesinArr = Object.values(allExpenses)
        allExpensesinArr.sort((a, b) => b.id - a.id)
    }

    return (
        <>
            <div className="shadow">
                <div className="flx line-h70 bg-maim-eee border-top-main border-bottom-main fontS-13px">
                    <div className="fontS-220rem width-50">All expenses</div>
                    <div className="btn-create">
                        <OpenModalButton
                            className={"button"}
                            buttonText="Add an expense"
                            modalComponent={<CreateExpense />}
                        />
                    </div>
                </div>

                <div className="grid-3fr height-5vh expense-summary" id="summary">
                    <div>Description</div>
                    <div>Expense Total</div>
                    <div>Bill Payer</div>
                </div>

                {/* check if user has any expenses on file, if so convert expenses object into array in order to manipulate the data */}
                {Object.keys(allExpenses).length === 0 ?
                    (<div>No Expenses....</div>) :
                    (<div className="line-5vh">
                        {allExpensesinArr.map(exp =>
                            <>
                                <div className="detail" key={exp.id}>
                                    <div
                                        onClick={() => {
                                            setCurrentId(exp.id);
                                            setShowDetail(!showDetail)
                                            singleExpensehandler(exp.id)
                                            loadCommentshandler(exp.id)
                                        }}
                                        className="grid-3fr height-8vh expense-summary "
                                        id="summary"
                                    >
                                        <div id="main-block" className="flx">
                                            <div id="date">
                                                {exp.expense_date}
                                            </div>
                                            <img className="img-size" src={"https://s3.amazonaws.com/splitwise/uploads/category/icon/square_v2/uncategorized/general@2x.png"} alt="img" />
                                            <div className="flx-col line-4vh">
                                                <div id="expense-name">
                                                    {exp.name}
                                                </div>

                                                {allGroupsIdArr.includes(exp.group_id) ? (<div id="expense-group" className="group-tag">{allGroups[exp.group_id].name}</div>) : (<div></div>)}
                                            </div>

                                        </div>
                                        <div>{`$` + Number(exp.expense_total).toFixed(2)}</div>
                                        <div className="flx">
                                            {/* {!exp.billpayer ? <div>Please input billpayer</div> : <div>{exp.billpayer.username}</div>} */}
                                            <div>{currentuser.username}</div>

                                            <div>{exp.username}</div>
                                            <OpenModalButton
                                                className={"height-max-40 mrg-t-10px mrg-l-20px"}
                                                buttonText={<i className="fas fa-trash-alt" />}
                                                modalComponent={
                                                    <DeleteConfirmationModal
                                                        expenseId={exp.id}
                                                        type="delete expense"
                                                    />
                                                }
                                            />
                                        </div>
                                    </div>


                                    <div
                                        className={showDetail && currentId === exp.id ? "display-b bg-detail-grey " : "display-n"}
                                        id="detail"
                                    >
                                        <ExpenseDetail
                                            exp={exp}
                                            // currentId={currentId}
                                            setShowDetail={setShowDetail}
                                            allCommentsArr={allCommentsArr}
                                        />
                                    </div>

                                </div>

                            </>
                        )}
                    </div>)}


            </div>
        </>

    );
}

export default ExpensesList;
