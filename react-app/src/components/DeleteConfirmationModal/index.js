import React from "react";
import { useModal } from "../../context/Modal";
import { useSelector, useDispatch } from 'react-redux';
import * as expensesthunk from "../../store/expense"
import * as groupsthunk from "../../store/group"



function DeleteConfirmationModal({ expenseId, type, groupid }) {
    console.log("this is delete modal with expenseId: ", expenseId, type, groupid)
    const dispatch = useDispatch()
    const { closeModal } = useModal()

    const deletehandler = () => {
        if (type === "delete expense") {
            dispatch(expensesthunk.deleteExpense(expenseId)).then(closeModal)
        } else if (type === "delete group") {
            dispatch(groupsthunk.deleteGroupthunk(groupid)).then(() => dispatch(groupsthunk.allGroupsthunk())).then(closeModal)
        }
    }

    // display different delete item based on passed in type
    let deleteitem;
    if (type === "delete expense") {
        deleteitem = "expense"
    } else if (type === "delete group") {
        deleteitem = "group"
    }

    return (
        <div className="width-350px height-350px">
            <header className="bg-5cc5a7">
                Delete confirmation
            </header>
            <div>
                Are you sure you want to delete this {deleteitem}?
                {type === "delete expense" ? (
                    <div>
                        This will completely remove this {deleteitem} for ALL people involved, not just you.
                    </div>
                ) :
                    (
                        <div>
                            This will completely remove this {deleteitem} for ALL expenses involved.
                        </div>
                    )
                }

            </div>
            <button onClick={deletehandler}>Yes</button>
            <button onClick={closeModal}>No</button>
        </div>

    )
}

export default DeleteConfirmationModal;
