import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom"
import * as expensesthunk from "../../store/expense"
import * as userthunk from "../../store/user"
import * as groupsthunk from "../../store/group"


function ExpenseModal({ type, expenseinfo, setShowDetail }) {
    console.log("expense modal with expense info: ", type, typeof expenseinfo.expense_total, expenseinfo.expense_total, expenseinfo)

    //get today and change the format
    const today = new Date()
    let year = today.getFullYear()
    let month = today.getMonth()
    let day = today.getDate()

    if (month < 10) {
        month = "0" + month
    }
    if (day < 10) {
        day = "0" + day
    }
    let formatedtoday = year + "-" + month + "-" + day

    //get currentuser
    const current_user = useSelector((state) => state.session.user)

    const dispatch = useDispatch();
    const [name, setName] = useState(expenseinfo.name)
    const [expense_total, setExpenseTotal] = useState(+expenseinfo.expense_total || 0)
    const [payer_user_id, setpayer_user_id] = useState(current_user.id)
    const [expense_date, setExpenseDate] = useState(formatedtoday)
    const [group_id, setGroup_id] = useState(expenseinfo.group_id)
    const [splitWithUsers, setSplitWithUsers] = useState([])
    const [errors, setErrors] = useState([])
    const [debtors, setdebtors] = useState([])
    let split_amount = expense_total


    const { closeModal } = useModal();
    //get all the groups and conver into arr
    const allGroups = useSelector((state) => state.groups.allGroups)
    let allGroupsArr = Object.values(allGroups)

    //get all the expenses and conver into arr
    const allExpenses = useSelector((state) => state.expenses.allExpenses)

    //get all the users and convert into arr
    const allUsers = useSelector((state) => state.users.allfriendsWithGroupInfo)
    let allUsersArr = Object.values(allUsers)

    //get the singleGroup
    const allUsers_inGroup = useSelector((state) => state.groups.singleGroup)
    console.log("allUsers_inGroup: ", allUsers_inGroup)


    // validation for expense name (description)
    useEffect(() => {
        let e = []
        if (!name) e.push("Please provide description")
        if (name.length > 15) e.push("Description is no more than 15 characters")
        if (!expense_total) e.push("Please provide amount")
        if (expense_total && expense_total <= 0) e.push("Amount should be greater than 0")
        if (debtors.length === 0) e.push("Please select debtors")
        setErrors(e)
    }, [name, expense_total, debtors])

    //FOR -split with section
    //if group_id change, debtors in split with section should be change
    //if group_id is selected, get singleGroup
    //if not selected, get allGroups/ allfriendsWithGroupInfo
    useEffect(() => {
        // dispatch(expensesthunk.allExpenses())
        dispatch(userthunk.allfriendsWithGroupInfo())
        dispatch(groupsthunk.singleGroupthunk(group_id))
    }, [group_id])

    //FOR -choose a group section
    //get all groups
    useEffect(() => {
        dispatch(groupsthunk.allGroupsthunk())
    }, [])


    //caculate split amount
    const handleSplitAmount = () => {
        debtors.map(debtor => debtor["owe_amount"] = split_amount / debtors.length)
    }



    //SplitWithUserHandler to collect all the debtors
    //if debtorId exsits in splitWithUsers we remove it
    //if debtorId dose not esxist in splitWithUsers we add on it
    const handleSplitWithUserChange = (e) => {
        console.log("FIRE FIRE FIRE FIRE")
        const debtorId = Number(e.target.value)
        console.log("打勾變動後的debtors: ", debtorId)
        //if nothing in debtors we just add it
        if (debtors.length === 0) {
            let debtor_select = debtors.push({ "debtor_id": debtorId, "owe_amount": split_amount })
            setdebtors(debtor_select)
            console.log("每次打勾就會加到debtors'裡面: ", debtors)

        } else {
            //if there's some debtor in debtors, we have to check if selected debtor can be found or not
            //if i the debtor is selected but can't be found in debtors we need to add on it
            //if can be found then we revmoe it
            let checked_debtor = debtors.filter(debtor => debtor["debtor_id"] === debtorId)

            if (checked_debtor.length === 0) {
                debtors.push({ "debtor_id": debtorId, "owe_amount": null })
                let added_debtor = debtors.find(debtor => debtor["debtor_id"] === debtorId)
                if (added_debtor) {
                    handleSplitAmount()
                }

            } else {
                let index = debtors.indexOf(checked_debtor[0])
                debtors.splice(index, 1)

            }

        }

    }



    const handleDateFormat = (e) => {
        let targetvalue = e.target.value
        setExpenseDate(targetvalue)
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (type === "create") {
            const payload = { name, expense_total, group_id, expense_date, payer_user_id, splitWithUsers, debtors }
            console.log("傳出去的payload: ", payload)
            await dispatch(expensesthunk.createExpense(payload))
            await dispatch(expensesthunk.allExpenses()).then(closeModal)
            // await dispatch(groupsthunk.singleGroupthunk(expenseinfo.group_id)).then(closeModal)
        } else if (type === "edit") {
            const payload = { name, expense_total, group_id, expense_date, payer_user_id, splitWithUsers, debtors }
            await dispatch(expensesthunk.updateExpense(expenseinfo.id, payload))
            await dispatch(expensesthunk.allExpenses()).then(closeModal)

            // await dispatch(groupsthunk.singleGroupthunk(expenseinfo.group_id)).then(closeModal)
            // .then(dispatch(groupsthunk.singleGroupthunk(expenseinfo.group_id))).then(closeModal)
            // .then(dispatch(expensesthunk.singleExpense(expenseinfo.id))).then(closeModal)
            setShowDetail(false)
        }

    }

    const groupIdhandler = (e) => {
        setGroup_id(e.target.value)
    }

    // function handleAlert() {
    //     alert("Feature Coming Soon.....")
    // }

    return (
        <>
            <form onSubmit={handleSubmit} className="modal">
                <div className="flx-col width-350px height-350px">
                    <header className=" bg-5cc5a7 line-h50">{type === "create" ? "Create an expense" : "Edit expense"}</header>
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

                            <select name="groups" id="group" onChange={(e) => setpayer_user_id(e.target.value)} defaultValue={current_user.id}>

                                <option value="">--Please choose people who paid this bill--</option>
                                {allUsers_inGroup[group_id] === undefined ?
                                    (allUsersArr.map(user => <option value={user.id === current_user.id ? (user.id) : (current_user.id)} selected={user.id === current_user.id}>{user.username}</option>))
                                    :
                                    (allUsers_inGroup[group_id].map(user => <option value={user.id === current_user.id ? (user.id) : (current_user.id)} selected={user.id === current_user.id}>{user.username}</option>))}

                            </select>


                        </div>

                        <div>
                            <fieldset>
                                <legend>Split with:</legend>
                                {allUsers_inGroup[group_id] === undefined ?
                                    (allUsersArr.map(user =>
                                        <>
                                            <div className="flx">
                                                <div>
                                                    <input type="checkbox" id={user.username} name="debtor" value={user.id} onChange={handleSplitWithUserChange} />
                                                    <lable for={user.username}>{user.username}</lable>
                                                </div>

                                                {/* {splitWithUsers.includes(user.id) ? (<div>{total_for_a_user}</div>) : (<div></div>)} */}

                                            </div>
                                        </>

                                    ))
                                    :
                                    (allUsers_inGroup[group_id].map(user =>
                                        <>
                                            <div className="flx">
                                                <div>
                                                    <input type="checkbox" id={user.username} name="debtor" value={user.id} onChange={handleSplitWithUserChange} />
                                                    <lable for={user.username}>{user.username}</lable>
                                                </div>


                                                {/* {splitWithUsers.includes(user.id) ? (<div>{total_for_a_user}</div>) : (<div></div>)} */}

                                            </div>
                                        </>
                                    ))
                                }

                            </fieldset>
                        </div>

                        <div>
                            <label>Expense date:</label>
                            <input type="date" min="2023-01-01" max="2024-12-31" value={expense_date} onChange={handleDateFormat} />


                        </div>

                        {/* <button onClick={handleAlert}>Paid by</button>
                        <div>
                            Bill Payer
                            <input
                                type="text"
                                value={payer_user_id}
                                onChange={(e) => setpayer_user_id(e.target.value)}
                            />
                        </div> */}
                    </div>
                    <div>
                        <button className="button-decision" type="submit" disabled={errors.length > 0}>save</button>
                        <button className="button-decision" onClick={closeModal}>cancel</button>
                    </div>
                </div>
            </form>
        </>

    );
}

export default ExpenseModal;
