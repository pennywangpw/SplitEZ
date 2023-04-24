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
    // let allExpensesArr = Object.values(allExpenses.expense)
    // let allBillPayerArr = Object.values(allExpenses.billpayer)

    //solution 1 good
    // let expenses = allExpenses.expense
    // let billpayers = allExpenses.billpayer

    // let allExpensesArr = Object.values(allExpenses)
    // console.log("this is expenses: ", allExpenses)
    // console.log("this is expenses: ", allExpensesArr)

    let expenses = allExpenses.expense
    let billpayers = allExpenses.billpayer

    console.log("************* ", expenses)
    console.log("************* ", billpayers)


    let allExpensesArr = Object.values(allExpenses)
    console.log("this is expenses: ", allExpenses)
    console.log("this is expenses: ", allExpensesArr)


    useEffect(() => {
        dispatch(expensesthunk.allExpenses())
    }, [dispatch])

    // const billPayerHandler = () => {
    //     dispatch(expensesthunk.getABillPayer(exp.payer_user_id))
    // }

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
                                    {/* <div>{dispatch(expensesthunk.getABillPayer(exp.payer_user_id))}</div> */}
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
