import ExpenseModal from "../ExpenseModal"

const EditExpense = ({ expenseinfo, setShowDetail }) => {

    return (
        <ExpenseModal type="edit" expenseinfo={expenseinfo} setShowDetail={setShowDetail} />

    )
}

export default EditExpense;
