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


    console.log("here's all expenses when i click specific group--useparams: ", groupId)
    console.log("here's all expenses when i click specific group: ", singlegroupinfo)

    useEffect(() => {
        dispatch(groupsthunk.singleGroupthunk(groupId))
        return () => dispatch(groupsthunk.clearGroupA())
    }, [dispatch, groupId])

    const singleExpensehandler = (id) => {
        dispatch(expensesthunk.singleExpense(id))
    }

    let allExpenses_belongs_group = singlegroupinfo.expenses
    if (!allExpenses_belongs_group) return (
        <div>No expense....</div>
    )

    console.log("here's all expenses when i click!!!!!: ", allExpenses_belongs_group)

    return (
        <>
            <div className="shadow">
                <div className="flx line-h70 ">
                    <div className="fontS-220rem width-50">{singlegroupinfo.name}</div>
                    <div>
                        <OpenModalButton
                            buttonText="Add an expense"
                            modalComponent={<CreateExpense />}
                        />
                    </div>
                </div>

                <div className="grid-3fr height-5vh" id="summary">
                    <div>description</div>
                    <div>Expense Total</div>
                    <div>Bill Payer</div>
                </div>


                <div className="line-5vh">
                    {allExpenses_belongs_group.map(exp =>
                        <>
                            <div onClick={() => {
                                setCurrentId(exp.id)
                                setShowDetail(!showDetail)
                                singleExpensehandler(exp.id)

                            }}>
                                <div className="grid-3fr height-5vh" id="summary">
                                    <div>{exp.expense_date}{exp.name} </div>
                                    <div>{exp.expense_total}</div>
                                    <div className="flx">

                                        <div>{exp.billpayer.username}</div>
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
