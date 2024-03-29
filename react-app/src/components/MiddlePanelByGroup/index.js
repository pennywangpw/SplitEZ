import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import OpenModalButton from "../OpenModalButton";
import * as groupsthunk from "../../store/group"
import * as expensesthunk from "../../store/expense"
import DeleteConfirmationModal from "../DeleteConfirmationModal"
import ExpenseModal from "../ExpenseModal"
import CreateExpense from "../CreateExpense"
import ExpenseDetail from "../ExpenseDetail"


function ExpensesListByGroup() {
    let { groupId } = useParams()
    const [showDetail, setShowDetail] = useState(false)
    const [currentId, setCurrentId] = useState(1)
    const dispatch = useDispatch();
    const singlegroupinfo = useSelector((state) => state.groups.singleGroup);
    const allExpenses = useSelector((state) => state.expenses.allExpenses);
    const singleExpense = useSelector((state) => state.expenses.singleExpense);
    const currentuser = useSelector((state) => state.session.user);
    const allComments = useSelector((state) => state.comments.allComments)
    const allUsers = useSelector((state) => state.users.allUsersWithGroupInfo)
    let allUsersArr = Object.values(allUsers)
    //get all expenses which group_id equals groupId chunk from the endpoint
    const allvaluesfromAllExpenses = Object.values(allExpenses)
    const allExpensesbyGroup = allvaluesfromAllExpenses.filter(expense => expense.group_id === +groupId)
    let all_debtors_id = []
    let debtors_name = [];
    let billpayer_name;
    console.log("=====這裡是ExpensesListByGroup")


    useEffect(() => {
        console.log("要測試,是不是因為點選了group delete model 所以執行了這裡的dispatch-middlepanelbygroup")
        dispatch(expensesthunk.allExpenses())
        dispatch(groupsthunk.singleGroupthunk(groupId))
        return () => dispatch(groupsthunk.clearGroupA())
    }, [dispatch, groupId])

    const singleExpensehandler = (id) => {
        dispatch(expensesthunk.singleExpense(id))
    }

    //convert allcomments into array
    const allCommentsArr = Object.values(allComments)

    //change the order of allExpensesinArr by descending
    let allExpensesinArr;
    if (Object.values(allExpensesbyGroup).length > 0) {
        allExpensesinArr = Object.values(allExpensesbyGroup)
        allExpensesinArr.sort((a, b) => b.id - a.id)
    }

    // change date format
    const date_format = (datestring) => {
        let new_format = new Date(datestring)
        // Request a weekday along with a long date
        const options = {
            // weekday: "long",
            // year: "numeric",
            month: "long",
            day: "numeric",
        };

        let new_date_format = new_format.toLocaleString("en-US", options)

        return new_date_format
    }

    //find debtors information
    //find all debtors id
    if (Object.keys(singleExpense).length !== 0) {

        for (let debtor of singleExpense.debtors) {
            all_debtors_id.push(debtor.debtor_id)
        }

    }
    //find the debtor name
    for (let friend of allUsersArr) {
        if (all_debtors_id.includes(friend.id)) {
            debtors_name.push(friend.username)
        }
    }

    //find bill payer name
    for (let friend of allUsersArr) {
        if (friend.user_id = singleExpense.payer_user_id) {
            billpayer_name = friend.username
        }
    }

    return (
        <>
            <div className="shadow">
                <div className="flx line-h70 bg-maim-eee border-top-main border-bottom-main fontS-13px ">
                    <div className="fontS-220rem width-50">{singlegroupinfo.name}</div>
                    <div className="btn-create">
                        <OpenModalButton
                            className={"button-orange"}
                            buttonText="Add an expense"
                            modalComponent={<CreateExpense />}
                        />
                    </div>
                </div>

                <div className="grid-3fr-5-3-2 margin-5-0-5-0 height-5vh expense-summary" id="summary">
                    <div>description</div>
                    <div>Expense Total</div>
                    <div>Bill Payer</div>
                </div>


                <div className="line-5vh">
                    {allExpensesbyGroup.length === 0 ?
                        (<div>No Expenses....</div>) :
                        (allExpensesinArr.map(exp =>
                            <>
                                <div key={exp.id} className="detail">
                                    <div onClick={() => {
                                        setCurrentId(exp.id)
                                        setShowDetail(!showDetail)
                                        singleExpensehandler(exp.id)
                                    }}
                                        className="grid-3fr-5-3-2 height-8vh expense-summary "
                                        id="summary"
                                    >
                                        <div id="main-block" className="flx">
                                            <div id="date">
                                                {exp.expense_date ? (<div>{date_format(exp.expense_date)}</div>) : (<div></div>)}
                                            </div>
                                            <img className="img-size" src={"https://s3.amazonaws.com/splitwise/uploads/category/icon/square_v2/uncategorized/general@2x.png"} alt="img" />
                                            <div className="flx-col line-4vh">
                                                <div id="expense-name">
                                                    {exp.name}
                                                </div>

                                                {/* {allGroupsIdArr.includes(exp.group_id) ? (<div id="expense-group" className="group-tag">{allGroups[exp.group_id].name}</div>) : (<div></div>)} */}
                                            </div>
                                        </div>

                                        {/* <div>{`$` + Number(exp.expense_total).toFixed(2)}</div> */}
                                        <div id="description">{`$` + Number(exp.expense_total).toFixed(2)}</div>
                                        <div id="billpayer" className="flx">
                                            {allUsersArr.map(user => {
                                                if (user.id === exp.payer_user_id) {

                                                    return <div>{user.username}</div>
                                                }

                                            })}

                                            <div>{exp.username}</div>
                                            <OpenModalButton
                                                className={"height-max-40 mrg-t-10px mrg-l-20px"}
                                                buttonText={<i className="fas fa-trash-alt" />}
                                                modalComponent={
                                                    <DeleteConfirmationModal
                                                        expenseId={exp.id}
                                                        type="delete expense"
                                                    />
                                                }
                                            />
                                        </div>

                                    </div>

                                    <div
                                        className={showDetail && currentId === exp.id ? "display-b bg-detail-grey " : "display-n"}
                                        id="detail"
                                    >
                                        <ExpenseDetail
                                            exp={exp}
                                            // currentId={currentId}
                                            setShowDetail={setShowDetail}
                                            allCommentsArr={allCommentsArr}
                                            debtors_name={debtors_name}
                                            billpayer_name={billpayer_name}
                                        />
                                    </div>
                                </div>
                            </>
                        ))}

                </div>
            </div>
        </>

    );
}

export default ExpensesListByGroup;
