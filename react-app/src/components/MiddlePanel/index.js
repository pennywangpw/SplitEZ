import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import OpenModalButton from "../OpenModalButton";
import * as expensesthunk from "../../store/expense"
import DeleteConfirmationModal from "../DeleteConfirmationModal"
import ExpenseModal from "../ExpenseModal"



function ExpensesList() {
    const dispatch = useDispatch();
    const allExpenses = useSelector((state) => state.expenses.allExpenses);
    let allExpensesArr = Object.values(allExpenses)
    console.log("this is expenses: ", allExpenses)
    console.log("this is expenses: ", allExpensesArr)

    useEffect(() => {
        dispatch(expensesthunk.allExpenses())
    }, [dispatch])

    // const deletehandler = (expenseId) => {
    //     console.log("trigger deletehandler: ", expenseId)
    //     dispatch(expensesthunk.deleteExpense(expenseId))
    //     // window.alert("Are you sure you want to delete this expense? This will completely remove this expense for ALL people involved, not just you.")
    // }


    if (allExpensesArr.length === 0) return (
        <div className="redwarning">
            "Loading...."
        </div>
    )

    return (
        <>
            <div className="panelborder bg-grey">
                <div className="flx">
                    <div className="fontS-220rem">{"All expenses"}</div>
                    <div>
                        <OpenModalButton
                            buttonText="Add an expense"
                            modalComponent={<ExpenseModal />}
                        />
                    </div>
                </div>

                <div className="height-5vh ">{"month"}</div>

                <div>
                    {allExpensesArr.map(exp =>
                        <>
                            <li className="grid-3fr height-5vh ">
                                <div>{exp.expense_date}{exp.name} </div>
                                <div>{exp.expense_total}</div>
                                <div className="flx">
                                    <div>{exp.payer_user_id}</div>
                                    {/* <OpenModalButton
                                        buttonText="delete expense"
                                        modalComponent={<DeleteConfirmationModal />}
                                    onButtonClick={deletehandler(exp.id)}

                                    /> */}
                                    {/* <button onClick={deletehandler}>
                                        {<i class="fas fa-trash-alt"></i>}
                                    </button> */}


                                </div>
                            </li>
                        </>
                    )}
                </div>
            </div>
        </>

    );
}

export default ExpensesList;
