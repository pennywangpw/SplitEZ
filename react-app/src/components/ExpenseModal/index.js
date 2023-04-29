import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom"
import * as expensesthunk from "../../store/expense"
import * as groupsthunk from "../../store/group"


function ExpenseModal({ type, expenseinfo, setShowDetail }) {
    console.log("expense modal with expense info: ", type, typeof expenseinfo.expense_total, expenseinfo.expense_total, expenseinfo)

    const dispatch = useDispatch();
    const history = useHistory()
    const [name, setName] = useState(expenseinfo.name)
    const [expense_total, setExpenseTotal] = useState(+expenseinfo.expense_total || 0)
    const [billpayer, setBillpayer] = useState("")
    const [errors, setErrors] = useState([])

    const { closeModal } = useModal();


    const allExpenses = useSelector((state) => state.expenses.allExpenses)
    let allExpensesArr = Object.values(allExpenses)

    console.log("expense modal: ", allExpensesArr)


    // validation for expense name (description)
    useEffect(() => {
        let e = []
        if (!name) e.push("Please provide description")
        if (name.length > 15) e.push("Description is no more than 15 characters")
        if (!expense_total) e.push("Please provide amount")
        if (expense_total && expense_total <= 0) e.push("Amount should be greater than 0")
        setErrors(e)
    }, [name, expense_total])


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (type === "create") {
            const payload = { name, expense_total }
            await dispatch(expensesthunk.createExpense(payload)).then(closeModal)
        } else if (type === "edit") {
            const payload = { name, expense_total }
            await dispatch(expensesthunk.updateExpense(expenseinfo.id, payload))
            await dispatch(groupsthunk.singleGroupthunk(expenseinfo.group_id)).then(closeModal)

            // .then(dispatch(groupsthunk.singleGroupthunk(expenseinfo.group_id))).then(closeModal)
            // .then(dispatch(expensesthunk.singleExpense(expenseinfo.id))).then(closeModal)
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
                        <div id="error">
                            {console.log("uuuuu here is all error: ", errors)}
                            {console.log("check what is expense total: ", typeof expense_total, expense_total)}


                            {errors.length > 0 && (

                                errors.map(error => <li>{error}</li>)

                            )}
                            {/* {errors.length > 0 ? (errors.map(error => <div>{error}</div>)) : <div className="line-h70"></div>} */}
                        </div>
                        <div>
                            <label htmlFor="description">
                                Description
                            </label>
                            <input
                                id="description"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="amount">
                                Amout
                            </label>
                            <input
                                id="amount"
                                type="text"
                                value={+expense_total}
                                onChange={(e) => setExpenseTotal(+e.target.value)}
                            />
                        </div>
                        {/* <div>
                            Bill Payer
                            <input
                                type="text"
                                value={billpayer}
                                onChange={(e) => setBillpayer(e.target.value)}
                            />
                        </div> */}
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
