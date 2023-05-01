import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import OpenModalButton from "../OpenModalButton";
import * as groupsthunk from "../../store/group"
import * as expensesthunk from "../../store/expense"
import DeleteConfirmationModal from "../DeleteConfirmationModal"
import ExpenseModal from "../ExpenseModal"
import CreateExpense from "../CreateExpense"
import ExpenseDetail from "../ExpenseDetail"


function ExpensesListByGroup() {
    let { groupId } = useParams()
    const [showDetail, setShowDetail] = useState(false)
    const [currentId, setCurrentId] = useState(1)
    const dispatch = useDispatch();
    const singlegroupinfo = useSelector((state) => state.groups.singleGroup);
    const allExpenses = useSelector((state) => state.expenses.allExpenses);

    //get all expenses which group_id equals groupId chunk from the endpoint
    const allvaluesfromAllExpenses = Object.values(allExpenses)
    const allExpensesbyGroup = allvaluesfromAllExpenses.filter(expense => expense.group_id === +groupId)


    useEffect(() => {
        dispatch(expensesthunk.allExpenses())
        dispatch(groupsthunk.singleGroupthunk(groupId))
        return () => dispatch(groupsthunk.clearGroupA())
    }, [dispatch, groupId])

    const singleExpensehandler = (id) => {
        dispatch(expensesthunk.singleExpense(id))
    }

    return (
        <>
            <div className="shadow">
                <div className="flx line-h70 bg-maim-eee border-top-main border-bottom-main fontS-13px ">
                    <div className="fontS-220rem width-50">{singlegroupinfo.name}</div>
                    <div className="btn-create button">
                        <OpenModalButton
                            buttonText="Add an expense"
                            modalComponent={<CreateExpense />}
                        />
                    </div>
                </div>

                <div className="grid-3fr height-5vh expense-summary" id="summary">
                    <div>description</div>
                    <div>Expense Total</div>
                    <div>Bill Payer</div>
                </div>


                <div className="line-5vh">
                    {allExpensesbyGroup.map(exp =>
                        <>
                            {console.log("each of exp: ", exp)}
                            <div onClick={() => {
                                setCurrentId(exp.id)
                                setShowDetail(!showDetail)
                                singleExpensehandler(exp.id)

                            }}>
                                <div className="grid-3fr height-5vh expense-summary" id="summary">
                                    <div>{exp.expense_date}{exp.name} </div>
                                    <div>{exp.expense_total}</div>
                                    <div className="flx">
                                        {exp.billpayer ? (<div>{exp.billpayer.username}</div>) : (<div></div>)}
                                        {/* <div>{exp.billpayer.username}</div> */}
                                        <div>{exp.username}</div>

                                        <OpenModalButton
                                            buttonText={<i class="fas fa-trash-alt"></i>}
                                            modalComponent={<DeleteConfirmationModal expenseId={exp.id} type="delete expense" groupid={groupId} />}
                                        />

                                    </div>
                                </div>

                                {console.log("WHAT'S CURRENTID AND EXP.ID: ", currentId, exp.id)}
                                <div className={showDetail && currentId === exp.id ? "display-b bg-detail-grey " : "display-n"} >
                                    <ExpenseDetail exp={exp} setShowDetail={setShowDetail} />
                                </div>


                            </div>

                        </>
                    )}
                </div>
            </div>
        </>

    );
}

export default ExpensesListByGroup;
