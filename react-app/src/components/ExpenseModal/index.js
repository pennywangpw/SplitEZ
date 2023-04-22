import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom"
import * as expensesthunk from "../../store/expense"


function ExpenseModal() {
    const dispatch = useDispatch();
    const history = useHistory()
    const [name, setName] = useState("")
    const [expense_total, setExpenseTotal] = useState("")


    const { closeModal } = useModal();


    const allExpenses = useSelector((state) => state.expenses.allExpenses)
    let allExpensesArr = Object.values(allExpenses)

    console.log("expense modal: ", allExpensesArr)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = { name, expense_total }
        console.log("this is payload: ", payload)
        await dispatch(expensesthunk.createExpense(payload)).then(closeModal)

    }


    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="flx-col width-350px height-350px line-h70">
                    <header className=" bg-5cc5a7 line-h50">{"create an expense"}</header>
                    <div>{`with you and: ${"1231"}`}</div>
                    <div>
                        <div>
                            {"Description"}
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            {"Amout"}
                            <input
                                type="text"
                                value={expense_total}
                                onChange={(e) => setExpenseTotal(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <button onClick={closeModal}>{"cancel"}</button>
                        <button type="submit">{"save"}</button>
                    </div>
                </div>
            </form>
        </>

    );
}

export default ExpenseModal;
