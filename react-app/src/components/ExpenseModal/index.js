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
    const [expense_date, setExpenseDate] = useState("")
    const [group_id, setGroup_id] = useState(expenseinfo.group_id)
    const [errors, setErrors] = useState([])

    const { closeModal } = useModal();
    console.log("expense_date: ", expense_date, typeof expense_date)
    //get all the groups and conver into arr
    const allGroups = useSelector((state) => state.groups.allGroups)
    let allGroupsArr = Object.values(allGroups)

    //get all the expenses and conver into arr
    const allExpenses = useSelector((state) => state.expenses.allExpenses)
    let allExpensesArr = Object.values(allExpenses)

    //get all the users and conver into arr
    const allUsers = useSelector((state) => state.users.friendsWithGroupInfo)
    let allUsersArr = Object.values(allUsers)

    //get currentuser
    const current_user = useSelector((state) => state.session.user)



    console.log("---CHECK GROUP ID: -- ", group_id)
    console.log("-----let's see th ", expense_total)
    console.log("expense modal: ", allExpensesArr)
    console.log("allUsersArr: ", allUsersArr)
    console.log("current_user:  ", current_user)




    // validation for expense name (description)
    useEffect(() => {
        let e = []
        if (!name) e.push("Please provide description")
        if (name.length > 15) e.push("Description is no more than 15 characters")
        if (!expense_total) e.push("Please provide amount")
        if (expense_total && expense_total <= 0) e.push("Amount should be greater than 0")
        setErrors(e)
    }, [name, expense_total])


    useEffect(() => {
        dispatch(expensesthunk.allExpenses())
    }, [group_id])

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (type === "create") {
            const payload = { name, expense_total, group_id, expense_date, billpayer }
            console.log("傳出去的payload: ", payload)
            await dispatch(expensesthunk.createExpense(payload)).then(closeModal)
            // await dispatch(groupsthunk.singleGroupthunk(expenseinfo.group_id)).then(closeModal)
        } else if (type === "edit") {
            const payload = { name, expense_total, group_id }
            await dispatch(expensesthunk.updateExpense(expenseinfo.id, payload))
            await dispatch(expensesthunk.allExpenses()).then(closeModal)

            // await dispatch(groupsthunk.singleGroupthunk(expenseinfo.group_id)).then(closeModal)
            // .then(dispatch(groupsthunk.singleGroupthunk(expenseinfo.group_id))).then(closeModal)
            // .then(dispatch(expensesthunk.singleExpense(expenseinfo.id))).then(closeModal)
            setShowDetail(false)
        }

    }

    const groupIdhandler = (e) => {
        console.log("***********f CHECK E.TARGET.VALUE: ", e.target.value)
        setGroup_id(e.target.value)
    }

    function handleAlert() {
        alert("Feature Coming Soon.....")
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="modal">
                {console.log("來看看render 幾次")}
                <div className="flx-col width-350px height-350px line-h70">
                    <header className=" bg-5cc5a7 line-h50">{type === "create" ? "Create an expense" : "Edit expense"}</header>
                    {/* <div>{`with you and: ${"1231"}`}</div> */}
                    <div>
                        <div>
                            <ul>
                                {errors.length > 0 && (errors.map((error, idx) => <li key={idx} className="height-max-15">{error}</li>))}
                            </ul>
                        </div>
                        <div>
                            <label htmlFor="description">Description:</label>
                            <input
                                id="description"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="amount">Amout:</label>
                            <input
                                id="amount"
                                type="number"
                                value={expense_total}
                                min="0"
                                step="any"
                                onChange={(e) => setExpenseTotal(parseFloat(e.target.value))}
                            />
                            {console.log("這裡是expense total: ", expense_total, typeof expense_total)}
                            {/* <input
                                id="amount"
                                type="text"
                                value={expense_total}
                                onChange={(e) => setExpenseTotal(parseFloat(e.target.value))}
                            /> */}
                        </div>
                        <div>
                            <label htmlFor="group">Choose a group:</label>

                            <select name="groups" id="group" onChange={groupIdhandler}>

                                <option value="">--Please choose an group--</option>
                                <option value="0">(No group) Move to All expenses</option>
                                {allGroupsArr.map(group => <option value={group.id} selected={expenseinfo.group_id === group.id}>{group.name}</option>)}

                            </select>
                        </div>

                        <div>
                            <label htmlFor="group">Paid by:</label>

                            <select name="groups" id="group" onChange={(e) => setBillpayer(e.target.value)}>

                                <option value="">--Please choose people who paid this bill--</option>
                                {allUsersArr.map(user => <option value={user.id} selected={user.id === current_user.id}>{user.username}</option>)}

                            </select>


                        </div>

                        <div>
                            <label htmlFor="group">Split with:</label>

                            <select name="groups" id="group" onChange={groupIdhandler}>

                                <option value="">--Please choose people who split this bill--</option>
                                {/* <option value="0">(No group) Move to All expenses</option> */}
                                {allUsersArr.map(user => <option value={user.id} selected={user.id === current_user.id}>{user.username}</option>)}

                            </select>
                        </div>

                        <div>
                            <label>Expense date:</label>
                            <input type="date" min="2023-01-01" max="2024-12-31" onChange={(e) => setExpenseDate(e.target.value)} />
                        </div>

                        {/* <button onClick={handleAlert}>Paid by</button>
                        <div>
                            Bill Payer
                            <input
                                type="text"
                                value={billpayer}
                                onChange={(e) => setBillpayer(e.target.value)}
                            />
                        </div> */}
                    </div>
                    <div>
                        <button className="button-decision" type="submit">save</button>
                        <button className="button-decision" onClick={closeModal}>cancel</button>
                    </div>
                </div>
            </form>
        </>

    );
}

export default ExpenseModal;
