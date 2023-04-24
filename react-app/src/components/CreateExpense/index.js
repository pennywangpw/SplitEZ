import ExpenseModal from "../ExpenseModal"

const CreateExpense = () => {
    const payload = {
        name: "",
        expense_total: ""
    }
    return (
        <ExpenseModal type="create" expenseinfo={payload} />
    )
}

export default CreateExpense;
