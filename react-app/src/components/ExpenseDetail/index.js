import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as expensesthunk from "../../store/expense"
import OpenModalButton from "../OpenModalButton";
import ExpenseModal from "../ExpenseModal"
import EditExpense from "../EditExpense"


function ExpenseDetail({ currentId, setShowDetail }) {
    console.log("ExpenseDetail with passed currentid: ", currentId, setShowDetail)
    const aExpanse = useSelector((state) => state.expenses.singleExpense)
    const dispatch = useDispatch()

    console.log("ExpenseDetail try to get a expense: ", aExpanse)

    useEffect(() => {
        dispatch(expensesthunk.singleExpense(currentId))
    }, [dispatch])


    return (
        <>
            <div className="height-350px">
                <div>
                    <div id="description">{aExpanse.name}</div>
                    <div id="description">{aExpanse.expense_total}</div>
                    <div>
                        <OpenModalButton
                            buttonText="Edit expense"
                            modalComponent={<EditExpense expenseinfo={aExpanse} setShowDetail={setShowDetail} />}
                        />
                    </div>
                </div>

                <div className="flx">
                    <div className="width-50 height-100">ppl involved</div>
                    <div className="width-50 height-100">comments</div>
                </div>
            </div>
        </>
    )
}

export default ExpenseDetail;
