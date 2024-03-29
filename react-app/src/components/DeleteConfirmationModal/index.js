import React from "react";
import { useModal } from "../../context/Modal";
import { useSelector, useDispatch } from 'react-redux';
import * as expensesthunk from "../../store/expense";
import * as groupsthunk from "../../store/group";
import * as commentsthunk from "../../store/comment";
import * as usersthunk from "../../store/user";
import * as friendsthunk from "../../store/friend";
import { useHistory } from "react-router-dom";



function DeleteConfirmationModal({ expenseId, type, id, commentid }) {
    console.log("this is delete modal with expenseId: ", expenseId, type, id, commentid)
    console.log("this is delete modal with expenseId-2: ", type, id)

    const dispatch = useDispatch()
    const history = useHistory()
    const { closeModal } = useModal()

    const deletehandler = () => {
        if (type === "delete expense") {
            dispatch(expensesthunk.deleteExpense(expenseId)).then(closeModal)
            // dispatch(expensesthunk.deleteExpense(expenseId)).then(() => dispatch(groupsthunk.singleGroupthunk(groupid))).then(closeModal)
        } else if (type === "delete group") {
            dispatch(groupsthunk.deleteGroupthunk(id))
                // .then(() => dispatch(usersthunk.allUsersWithGroupInfo()))
                // .then(() => dispatch(expensesthunk.allExpenses()))
                .then(closeModal)
            history.push('/all')

        } else if (type === "delete comment") {
            dispatch(commentsthunk.deleteComments(commentid)).then(() => dispatch(commentsthunk.allComments(expenseId))).then(closeModal)

        } else if (type === "delete friend") {
            dispatch(friendsthunk.deleteFriendthunk(id))
                .then(() => dispatch(usersthunk.allUsersWithGroupInfo()))
                .then(closeModal)
            history.push("/all")
        }
    }

    // display different delete item based on passed in type
    let deleteitem;
    if (type === "delete expense") {
        deleteitem = "expense"
    } else if (type === "delete group") {
        deleteitem = "group"
    } else if (type === "delete comment") {
        deleteitem = "comment"
    } else if (type === "delete friend") {
        deleteitem = "friend"
    }

    return (
        <div className="modal-delete modal-delete ">
            <header className="bg-5cc5a7">
                Delete confirmation
            </header>
            <div>
                Are you sure you want to delete this {deleteitem}?
                {type === "delete expense" && (
                    <div>
                        This will completely remove this {deleteitem} for ALL people involved, not just you.
                    </div>
                )}
                {type === "delete group" && (
                    <div>
                        This will completely remove this {deleteitem} for ALL expenses involved.
                    </div>
                )}


            </div>
            <button className="button-decision" onClick={deletehandler}>Yes</button>
            <button className="button-decision" onClick={closeModal}>No</button>
        </div>

    )
}

export default DeleteConfirmationModal;
