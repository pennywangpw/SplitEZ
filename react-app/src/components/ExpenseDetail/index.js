import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as expensesthunk from "../../store/expense"


function ExpenseDetail({ currentId }) {
    console.log("ExpenseDetail with passed currentid: ", currentId)
    const aExpanse = useSelector((state) => state.expenses.singleExpense)
    let aExpanseArr = Object.values(aExpanse)
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
