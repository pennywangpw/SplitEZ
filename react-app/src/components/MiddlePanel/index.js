import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import OpenModalButton from "../OpenModalButton";
import * as expensesthunk from "../../store/expense"
import DeleteConfirmationModal from "../DeleteConfirmationModal"
import ExpenseModal from "../ExpenseModal"
import CreateExpense from "../CreateExpense"
import ExpenseDetail from "../ExpenseDetail"



function ExpensesList() {
    const [showDetail, setShowDetail] = useState(false)
    const [currentId, setCurrentId] = useState(1)
    const dispatch = useDispatch();
    const allExpenses = useSelector((state) => state.expenses.allExpenses);


    useEffect(() => {
        dispatch(expensesthunk.allExpenses())
    }, [dispatch])



    // convert expenses object into array in order to manipulate the data
    let allExpensesArr = Object.values(allExpenses)
    console.log("frontend allexpenses arr: ", allExpensesArr)


    if (allExpensesArr.length === 0) return (
        <div className="redwarning">
            "Loading...."
        </div>
    )


    return (
        <>
            <div className="shadow">
                <div className="flx line-h70 ">
                    <div className="fontS-220rem width-50">All expenses</div>
                    <div>
                        <OpenModalButton
                            buttonText="Add an expense"
                            modalComponent={<CreateExpense />}
                        />
                    </div>
                </div>

                <div className="height-5vh ">month</div>

                <div className="line-5vh">
                    {allExpensesArr.map(exp =>
                        <>
                            <div onClick={() => {
                                setCurrentId(exp.id)
                                setShowDetail(!showDetail)
                            }}>
                                <div className="grid-3fr height-5vh" id="summary">
                                    <div>{exp.expense_date}{exp.name} </div>
                                    <div>{exp.expense_total}</div>
                                    <div className="flx">

                                        <div>{exp.payer_user_id}</div>
                                        <div>{exp.username}</div>

                                        <OpenModalButton
                                            buttonText={<i class="fas fa-trash-alt"></i>}
                                            modalComponent={<DeleteConfirmationModal expenseId={exp.id} type="delete expense" />}
                                        />

                                    </div>
                                </div>


                                <div className={showDetail === true ? "display-b" : "display-n"} >
                                    <ExpenseDetail currentId={currentId} setShowDetail={setShowDetail} />
                                </div>

                                {/* {showDetail === true ?
                                    (<div className="detail testing-bg" >
                                        <ExpenseDetail currentId={currentId} setShowDetail={setShowDetail} />
                                    </div>) : <div></div>
                                } */}

                            </div>

                        </>
                    )}
                </div>
            </div>
        </>

    );
}

export default ExpensesList;
