import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import OpenModalButton from "../OpenModalButton";
import * as expensesthunk from "../../store/expense"
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

    return (
        <>
            <div className="shadow">

                <div className="flx line-h70 bg-maim-eee border-top-main border-bottom-main fontS-13px">
                    <div className="fontS-220rem width-50">All expenses</div>
                    <div >
                        <OpenModalButton
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
                        {Object.values(allExpenses).map(exp =>
                            <>
                                <div key={exp.id}>
                                    <div
                                        onClick={() => {
                                            setCurrentId(exp.id);
                                            setShowDetail(!showDetail)
                                            singleExpensehandler(exp.id)
                                        }}
                                        className="grid-3fr height-8vh expense-summary "
                                        id="summary"
                                    >
                                        <div className="flx-col">
                                            <div>
                                                {exp.expense_date}
                                                {exp.name}
                                            </div>

                                            {allGroupsIdArr.includes(exp.group_id) ? (<div>{exp.group_id}</div>) : (<div></div>)}

                                        </div>
                                        <div>{exp.expense_total}</div>
                                        <div className="flx">
                                            {/* {!exp.billpayer ? <div>Please input billpayer</div> : <div>{exp.billpayer.username}</div>} */}
                                            <div>{currentuser.username}</div>

                                            <div>{exp.username}</div>
                                            <OpenModalButton
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
