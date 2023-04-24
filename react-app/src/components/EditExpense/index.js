import ExpenseModal from "../ExpenseModal"

const EditExpense = ({ expenseinfo }) => {
    console.log("eidt expense with passed in expenseinfo: ", expenseinfo)

    return (
        <ExpenseModal type="edit" expenseinfo={expenseinfo} />

    )
}

export default EditExpense;
