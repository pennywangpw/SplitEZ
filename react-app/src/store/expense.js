const GETALLEXPENSES = 'expenses/ALL';
const GETAEXPENSE = 'expenses/SINGLE';
const POSTAEXPENSE = 'expenses/CREATEEXPENSE';
const DELETETAEXPENSE = 'expenses/DELETEEXPENSE';


//action creator
const allExpensesA = (obj) => {
    console.log("this is action creator")

    return {
        type: GETALLEXPENSES,
        obj
    };
};

const singleExpenseA = (obj) => {
    console.log("this is action creator-single expense")

    return {
        type: GETAEXPENSE,
        obj
    };
};


const createAExpenseA = (obj) => {
    console.log("this is action creator-create a expense")

    return {
        type: POSTAEXPENSE,
        obj
    };
};


const deleteAExpenseA = (obj) => {
    console.log("this is action creator-delete a expense")

    return {
        type: DELETETAEXPENSE,
        obj
    };
};


//allExpenses thunk
export const allExpenses = () => async (dispatch) => {
    console.log("this is thunk")
    const response = await fetch(`/api/expenses/all`)
    if (response.ok) {
        const data = await response.json();
        dispatch(allExpensesA(data));
    };
    return response
};

//singleExpense thunk
export const singleExpense = (expenseid) => async (dispatch) => {
    console.log("this is thunk-singleExpense")
    const response = await fetch(`/api/expenses/${expenseid}`)
    if (response.ok) {
        const data = await response.json();
        dispatch(singleExpenseA(data));
    };
    return response
};

//createExpense thunk

export const createExpense = (payload) => async (dispatch) => {
    console.log("this is thunk-createExpense")
    const response = await fetch(`/api/expenses/all`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })

    if (response.ok) {
        console.log("createExpense check if res is okay")
        const data = await response.json();
        console.log("createExpense check if res is okay2: ", data)

        dispatch(createAExpenseA(data));
    };
    return response
};


//deleteExpense thunk
export const deleteExpense = (expenseId) => async (dispatch) => {
    console.log("this is thunk-deleteAExpense", expenseId)
    const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        const data = await response.json();
        dispatch(deleteAExpenseA(data));
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

        // case GETAEXPENSE:
        //     let newState2 = { ...state }
        //     newState2.singleExpense
        case POSTAEXPENSE:
            // let newState3 = { ...state }
            let newState3 = { allExpenses: { ...state.allExpenses }, singleExpense: {} };
            let newExpense = action.obj
            newState3.allExpenses[newExpense.id] = newExpense
            return newState3

        case DELETETAEXPENSE:
            let newState4 = { ...state, allExpenses: { ...state.allExpenses }, singleExpense: { ...state.singleExpense } };
            let deletedExpense = action.obj.id
            delete newState4.allExpenses[deletedExpense]
            return newState4




        default:
            return state;
    }
};

export default expensesReducer;
