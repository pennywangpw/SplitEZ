import ExpenseModal from "../ExpenseModal"

const EditExpense = ({ expenseinfo, setShowDetail }) => {
    console.log("eidt expense with passed in expenseinfo: ", expenseinfo)

    return (
        <ExpenseModal type="edit" expenseinfo={expenseinfo} setShowDetail={setShowDetail} />

    )
}

export default EditExpense;
