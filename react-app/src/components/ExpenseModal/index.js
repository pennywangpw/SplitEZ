import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom"
import * as expensesthunk from "../../store/expense"


function ExpenseModal({ type, expenseinfo, setShowDetail }) {
    console.log("expense modal with expense info: ", type, expenseinfo)
    const dispatch = useDispatch();
    const history = useHistory()
    const [name, setName] = useState(expenseinfo.name)
    const [expense_total, setExpenseTotal] = useState(expenseinfo.expense_total)
    const [billpayer, setBillpayer] = useState("")

    const { closeModal } = useModal();


    const allExpenses = useSelector((state) => state.expenses.allExpenses)
    let allExpensesArr = Object.values(allExpenses)

    console.log("expense modal: ", allExpensesArr)


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (type === "create") {
            const payload = { name, expense_total }
            await dispatch(expensesthunk.createExpense(payload)).then(closeModal)
        } else if (type === "edit") {
            const payload = { name, expense_total }
            await dispatch(expensesthunk.updateExpense(expenseinfo.id, payload))
            await dispatch(expensesthunk.singleExpense(expenseinfo.id)).then(closeModal)
            setShowDetail(false)
        }

    }


    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="flx-col width-350px height-350px line-h70">
                    <header className=" bg-5cc5a7 line-h50">{type === "create" ? "Create an expense" : "Edit expense"}</header>
                    {/* <div>{`with you and: ${"1231"}`}</div> */}
                    <div>
                        <div>
                            Description
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            Amout
                            <input
                                type="text"
                                value={expense_total}
                                onChange={(e) => setExpenseTotal(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            Bill Payer
                            <input
                                type="text"
                                value={billpayer}
                                onChange={(e) => setBillpayer(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <button type="submit">save</button>
                        <button onClick={closeModal}>cancel</button>
                    </div>
                </div>
            </form>
        </>

    );
}

export default ExpenseModal;
