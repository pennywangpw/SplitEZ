const GETALLEXPENSES = 'expenses/ALL';

//action creator
const allExpensesA = (obj) => {
    console.log("this is action creator")

    return {
        type: GETALLEXPENSES,
        obj
    };
};

// thunk
export const allExpenses = () => async (dispatch) => {
    console.log("this is thunk")
    const response = await fetch(`/api/expenses/all`)
    if (response.ok) {
        const data = await response.json();
        dispatch(allExpensesA(data));
    };
    return response
};


const initialState = {
    allExpenses: {},
    singleExpense: {}
}

//Reducer
const expensesReducer = (state = initialState, action) => {
    console.log("expenseReducer with action: ", action)
    console.log("expenseReducer with action obj: ", action.obj)
    console.log("initial : ", state)

    switch (action.type) {
        case GETALLEXPENSES:
            let newState1 = { allExpenses: { ...state.allExpenses }, singleExpense: {} };
            // let newState1 = { ...state };
            // console.log("before adding : ", newState1)
            action.obj.expenses.forEach(expense => newState1.allExpenses[expense.id] = expense)
            // console.log("after adding: ", newState1)
            return newState1;

        default:
            return state;
    }
};

export default expensesReducer;
