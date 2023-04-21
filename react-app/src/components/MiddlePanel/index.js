import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import * as expensesthunk from "../../store/expense"
import LeftPanel from "../LeftPanel";



function ExpensesList() {
    const dispatch = useDispatch();
    const allExpenses = useSelector((state) => state.expenses.allExpenses);
    let allExpensesArr = Object.values(allExpenses)
    console.log("this is expenses: ", allExpenses)
    console.log("this is expenses: ", allExpensesArr)

    useEffect(() => {
        dispatch(expensesthunk.allExpenses())
    }, [dispatch])



    if (allExpensesArr.length === 0) return (
        <div className="redwarning">
            "Loading...."
        </div>
    )

    return (
        <>
            <div className="panelborder bg-grey">
                <div className="fontS-220rem">{"All expenses"}</div>
                {allExpensesArr.map(exp =>
                    <>
                        <li className="grid-3fr">
                            <div>{exp.expense_date}{exp.name} </div>
                            <div>{exp.expense_total}</div>
                            <div>{exp.payer_user_id}</div>
                        </li>
                    </>
                )}
            </div>
        </>

    );
}

export default ExpensesList;
