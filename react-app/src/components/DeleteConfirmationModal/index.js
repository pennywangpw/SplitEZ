import React from "react";
import { useModal } from "../../context/Modal";
import { useSelector, useDispatch } from 'react-redux';
import * as expensesthunk from "../../store/expense"




function DeleteConfirmationModal({ expenseId }) {
    console.log("this is delete modal with expenseId: ", expenseId)
    const dispatch = useDispatch()
    const { closeModal } = useModal()

    const deletehandler = () => {
        dispatch(expensesthunk.deleteExpense(expenseId)).then(closeModal)
    }

    return (
        <div className="width-350px height-350px">
            <header className="bg-5cc5a7">
                Delete confirmation
            </header>
            <div>
                Are you sure you want to delete this expense? This will completely remove this expense for ALL people involved, not just you.
            </div>
            <button onClick={deletehandler}>Yes</button>
            <button onClick={closeModal}>No</button>
        </div>

    )
}

export default DeleteConfirmationModal;
