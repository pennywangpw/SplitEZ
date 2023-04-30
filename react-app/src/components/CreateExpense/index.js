import ExpenseModal from "../ExpenseModal"

const CreateExpense = () => {
    const payload = {
        name: "",
        expense_total: 0,
        group_id: 0
    }
    return (
        <ExpenseModal type="create" expenseinfo={payload} />
    )
}

export default CreateExpense;
