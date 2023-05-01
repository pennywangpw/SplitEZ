import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as expensesthunk from "../../store/expense"
import OpenModalButton from "../OpenModalButton";
import ExpenseModal from "../ExpenseModal"
import EditExpense from "../EditExpense"


function ExpenseDetail({ exp, setShowDetail }) {
    console.log("exp detail here: ", exp)
    // console.log("ExpenseDetail with passed currentid: ", typeof currentId, currentId, setShowDetail)
    // const aExpanse = useSelector((state) => state.expenses.singleExpense)
    // const dispatch = useDispatch()

    // console.log("ExpenseDetail try to get a expense: ", aExpanse)

    // useEffect(() => {
    //     dispatch(expensesthunk.singleExpense(currentId))
    // }, [dispatch])

    //alert function for comment button
    function handleAlert() {
        alert("Feature Coming Soon.....")
    }

    // if (!aExpanse) return null
    if (!exp) return null

    return (
        <>
            <div className="height-350px">
                <div className="height-50">
                    <div id="description">{exp.name}</div>
                    <div id="description">${exp.expense_total}</div>
                    <div className="detail">
                        <OpenModalButton
                            buttonText="Edit expense"
                            modalComponent={<EditExpense expenseinfo={exp} setShowDetail={setShowDetail} />}
                        />
                    </div>
                </div>


                <div className=" height-50 flx">
                    <div className="width-50">Who's in the group (coming soon)</div>
                    {/* <div className="width-50 height-100">ppl involved</div> */}
                    {/* <div className="width-50 height-100">comments</div> */}
                    <div className="comment width-100">
                        <button className=" width-50" onClick={handleAlert}>comments</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ExpenseDetail;
