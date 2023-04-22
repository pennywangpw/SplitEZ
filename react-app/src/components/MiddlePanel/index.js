import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import OpenModalButton from "../OpenModalButton";
import * as expensesthunk from "../../store/expense"
import DeleteConfirmationModal from "../DeleteConfirmationModal"
import ExpenseModal from "../ExpenseModal"
import ExpenseDetail from "../ExpenseDetail"



function ExpensesList() {
    const [showDetail, setShowDetail] = useState(false)
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
                            <li className="grid-3fr height-5vh " onClick={() => dispatch(expensesthunk.singleExpense(exp.id)).then(setShowDetail(!showDetail))}>
                                <div>{exp.expense_date}{exp.name} </div>
                                <div>{exp.expense_total}</div>
                                <div className="flx">
                                    <div>{exp.payer_user_id}</div>
                                    <OpenModalButton
                                        buttonText={<i class="fas fa-trash-alt"></i>}
                                        modalComponent={<DeleteConfirmationModal expenseId={exp.id} />}
                                    />

                                </div>
                            </li>
                            {showDetail === true ?
                                (<div className="detail" >
                                    <ExpenseDetail exp={exp} />
                                </div>) : <div></div>
                            }
                        </>
                    )}
                </div>
            </div>
        </>

    );
}

export default ExpensesList;
