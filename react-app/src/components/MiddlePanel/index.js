import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import OpenModalButton from "../OpenModalButton";
import * as expensesthunk from "../../store/expense"
import DeleteConfirmationModal from "../DeleteConfirmationModal"
import ExpenseModal from "../ExpenseModal"
import ExpenseDetail from "../ExpenseDetail"



function ExpensesList() {
    const [showDetail, setShowDetail] = useState(false)
    const [currentId, setCurrentId] = useState(0)
    const dispatch = useDispatch();
    const allExpenses = useSelector((state) => state.expenses.allExpenses);


    useEffect(() => {
        dispatch(expensesthunk.allExpenses())
    }, [dispatch])

    // get expense and billpayer object
    let expenses = allExpenses.expense
    let billpayers = allExpenses.billpayer


    if (!expenses) return (
        <div>Not ready</div>
    )

    // convert expenses object into array in order to manipulate the data
    let allExpensesArr = Object.values(expenses)


    if (allExpensesArr.length === 0) return (
        <div className="redwarning">
            "Loading...."
        </div>
    )


    return (
        <>
            <div className="panelborder bg-grey">
                <div className="flx line-h70 ">
                    <div className="fontS-220rem width-50">All expenses</div>
                    <div>
                        <OpenModalButton
                            buttonText="Add an expense"
                            modalComponent={<ExpenseModal />}
                        />
                    </div>
                </div>

                <div className="height-5vh ">month</div>

                <div className="line-5vh">
                    {allExpensesArr.map(exp =>
                        <>
                            <li className="grid-3fr height-5vh " onClick={() => {
                                setCurrentId(exp.id)
                                setShowDetail(!showDetail)
                            }}>
                                <div>{exp.expense_date}{exp.name} </div>
                                <div>{exp.expense_total}</div>
                                <div className="flx">
                                    <div>{billpayers.username}</div>
                                    <div>{exp.payer_user_id}</div>
                                    <OpenModalButton
                                        buttonText={<i class="fas fa-trash-alt"></i>}
                                        modalComponent={<DeleteConfirmationModal expenseId={exp.id} />}
                                    />

                                </div>
                            </li>
                        </>
                    )}
                    {showDetail === true ?
                        (<div className="detail" >
                            <ExpenseDetail currentId={currentId} />
                        </div>) : <div></div>
                    }
                </div>
            </div>
        </>

    );
}

export default ExpensesList;
