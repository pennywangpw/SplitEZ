import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom"
import * as expensesthunk from "../../store/expense"
import * as userthunk from "../../store/user"
import * as groupsthunk from "../../store/group"


function ExpenseModal({ type, expenseinfo, setShowDetail }) {
    console.log("expense modal with expense info: ", type, typeof expenseinfo.expense_total, expenseinfo.expense_total, expenseinfo)

    //get today
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
    const history = useHistory()
    const [name, setName] = useState(expenseinfo.name)
    const [expense_total, setExpenseTotal] = useState(+expenseinfo.expense_total || 0)
    const [payer_user_id, setpayer_user_id] = useState(current_user.id)
    const [expense_date, setExpenseDate] = useState(formatedtoday)
    const [group_id, setGroup_id] = useState(expenseinfo.group_id)
    const [splitWithUsers, setSplitWithUsers] = useState([])
    const [splitUsers_price, setSplitUsers_price] = useState({})
    const [total_for_a_user, setTotal_for_a_user] = useState(0)



    const [errors, setErrors] = useState([])

    const { closeModal } = useModal();
    //get all the groups and conver into arr
    const allGroups = useSelector((state) => state.groups.allGroups)
    let allGroupsArr = Object.values(allGroups)


    //get all the expenses and conver into arr
    const allExpenses = useSelector((state) => state.expenses.allExpenses)

    //get all the users and convert into arr
    const allUsers = useSelector((state) => state.users.friendsWithGroupInfo)
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
        setErrors(e)
    }, [name, expense_total])


    //if group_id change splitWithUsers should be changed
    useEffect(() => {
        dispatch(expensesthunk.allExpenses())
        dispatch(userthunk.friendsWithGroupInfo())
        dispatch(groupsthunk.singleGroupthunk(group_id))
    }, [group_id])


    useEffect(() => {
        dispatch(groupsthunk.allGroupsthunk())
    }, [])

    useEffect(() => {
        console.log("Updated splitWithUsers: ", splitWithUsers);
    }, [splitWithUsers]);

    //SplitWithUserHandler to collect all the debtors
    //if debtorId exsits in splitWithUsers we remove it
    //if debtorId dose not esxist in splitWithUsers we add on it
    const handleSplitWithUserChange = (e) => {
        const debtorId = Number(e.target.value)
        console.log("debtorId: ", debtorId, typeof debtorId)
        console.log("allUsers_inGroup[group_id]: ", allUsers_inGroup[group_id])

        //collect split users' id without duplicating
        if (!splitWithUsers.includes(debtorId)) {
            splitWithUsers.push(debtorId)
            console.log("點選後的-人數: ", splitWithUsers)

        } else {
            const index = splitWithUsers.indexOf(debtorId);
            splitWithUsers.splice(index, 1);
            console.log("點選後的-人數: ", splitWithUsers);
        }

        //if uesr input a total, caculate split amount for each split user
        if (splitWithUsers.length === 0) setTotal_for_a_user(0)
        if (expense_total > 0 && splitWithUsers.length > 0) {
            setTotal_for_a_user(expense_total / splitWithUsers.length)
            console.log("分帳後的$-toal: ", total_for_a_user, typeof total_for_a_user)
            console.log("分帳後的$-人數: ", splitWithUsers.length)

            // console.log("分帳後的$: ", total_for_a_user, typeof total_for_a_user)
        }



    }
    // let split_with_users = []
    // let total_for_a_user = 0
    // const handleSplitWithUserChange = (e) => {
    //     const debtorId = e.target.value
    //     console.log("debtorId: ", debtorId)
    //     console.log("allUsers_inGroup[group_id]: ", allUsers_inGroup[group_id])

    //     //collect split users' id without duplicating
    //     if (!split_with_users.includes(debtorId)) {
    //         split_with_users.push(debtorId)
    //         console.log("點選後的-人數: ", split_with_users)

    //     } else {
    //         const index = split_with_users.indexOf(debtorId);
    //         split_with_users.splice(index, 1);
    //         console.log("點選後的-人數: ", split_with_users);
    //     }

    //     //if uesr input a total, caculate split amount for each split user
    //     if (expense_total > 0) {

    //         total_for_a_user = expense_total / split_with_users.length
    //         console.log("分帳後的$-toal: ", expense_total, typeof expense_total)
    //         console.log("分帳後的$-人數: ", split_with_users.length)

    //         // console.log("分帳後的$: ", total_for_a_user, typeof total_for_a_user)
    //     }

    //     setSplitWithUsers([...split_with_users])

    // }


    const handleDateFormat = (e) => {
        let targetvalue = e.target.value
        setExpenseDate(targetvalue)
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (type === "create") {
            const payload = { name, expense_total, group_id, expense_date, payer_user_id, splitWithUsers, splitUsers_price }
            console.log("傳出去的payload: ", payload)
            await dispatch(expensesthunk.createExpense(payload))
            await dispatch(expensesthunk.allExpenses()).then(closeModal)
            // await dispatch(groupsthunk.singleGroupthunk(expenseinfo.group_id)).then(closeModal)
        } else if (type === "edit") {
            const payload = { name, expense_total, group_id, expense_date, payer_user_id, splitWithUsers, splitUsers_price }
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
                                {/* {allUsersArr.map(user => <option value={user.id === current_user.id ? (user.id) : (current_user.id)} selected={user.id === current_user.id}>{user.username}</option>)} */}
                                {allUsersArr.map(user => <option value={user.id} >{user.username}</option>)}

                                {/* {allUsersArr.map(user => <option value={user.id} selected={user.id === current_user.id}>{user.username}</option>)} */}

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
                                                {splitWithUsers.includes(user.id) ? (<div>{total_for_a_user}</div>) : (<div></div>)}

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
                                                {splitWithUsers.includes(user.id) ? (<div>{total_for_a_user}</div>) : (<div></div>)}

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
                        <button className="button-decision" type="submit">save</button>
                        <button className="button-decision" onClick={closeModal}>cancel</button>
                    </div>
                </div>
            </form>
        </>

    );
}

export default ExpenseModal;
