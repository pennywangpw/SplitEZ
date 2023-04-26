const GETALLEXPENSES = 'expenses/ALL_EXPENSE';
const GETAEXPENSE = 'expenses/SINGLE';
const POSTAEXPENSE = 'expenses/CREATE_EXPENSE';
const DELETETAEXPENSE = 'expenses/DELETE_EXPENSE';
const UPDATEAEXPENSE = 'expenses/UPDATE_EXPENSE';

// const GETBILLPAYER = 'expenses/GETBILLPAYER';



//action creator
const allExpensesA = (arr) => {
    console.log("this is action creator")

    return {
        type: GETALLEXPENSES,
        arr
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

const updateExpenseA = (obj) => {
    console.log("this is action creator-delete a expense")

    return {
        type: UPDATEAEXPENSE,
        obj
    };
}

// const getBillPayerA = (obj) => {
//     console.log("this is action creator-getBillPayerA")

//     return {
//         type: GETBILLPAYER,
//         obj
//     };
// };


//allExpenses thunk
export const allExpenses = () => async (dispatch) => {
    console.log("this is thunk")
    const response = await fetch(`/api/expenses/all`)
    if (response.ok) {
        const data = await response.json();
        console.log("allExpenses thunk check what i got from bk: ", data)
        dispatch(allExpensesA(data));
    };
    return response
};

//singleExpense thunk
export const singleExpense = (expenseid) => async (dispatch) => {
    console.log("this is thunk-singleExpense", expenseid)
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
    console.log("this is thunk-deleteAExpense", typeof expenseId, expenseId)
    const response = await fetch(`/api/expenses/${expenseId}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        const data = await response.json();
        dispatch(deleteAExpenseA(data));
    };
    return response
};

//updateExpense thunk
export const updateExpense = (expenseid, payload) => async (dispatch) => {
    const response = await fetch(`/api/expenses/${expenseid}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })
    if (response.ok) {
        const data = await response.json();
        dispatch(updateExpenseA(data));
    };
    return response
};

// //get bill payer thunk
// export const getABillPayer = (payerId) => async (dispatch) => {
//     console.log("this is thunk-getABillPayer", payerId)
//     const response = await fetch(`/api/expenses/all`)
//     if (response.ok) {
//         const data = await response.json();
//         dispatch(getBillPayerA(data));
//     };
//     return response
// };


const initialState = {
    allExpenses: {},
    singleExpense: {}
}

//Reducer
const expensesReducer = (state = initialState, action) => {
    console.log("expenseReducer with action: ", action)
    console.log("expenseReducer with action obj: ", action.obj)
    console.log("expenseReducer with action arr: ", action.arr)

    console.log("initial : ", state)

    switch (action.type) {
        case GETALLEXPENSES:
            let newState1 = { allExpenses: { ...state.allExpenses }, singleExpense: {} };
            action.arr.forEach(expense => newState1.allExpenses[expense.id] = expense)
            console.log("after adding 1: ", newState1)
            return newState1;

        case GETAEXPENSE:
            let newState2 = { allExpenses: { ...state.allExpenses }, singleExpense: { ...state.singleExpense } };
            let selectedExpense = action.obj
            newState2.singleExpense = selectedExpense
            return newState2

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

        case UPDATEAEXPENSE:
            let newState5 = { ...state, allExpenses: { ...state.allExpenses }, singleExpense: { ...state.singleExpense } };
            let updateExpense = action.obj
            newState5.allExpenses[updateExpense.id] = updateExpense
            return newState5
        // case GETBILLPAYER:
        //     let newState5 = { ...state, allExpenses: { ...state.allExpenses }, singleExpense: { ...state.singleExpense } };
        //     action.obj.expenses.forEach(expense => newState5.allExpenses[expense.id] = expense)
        //     return "newState5"


        default:
            return state;
    }
};

export default expensesReducer;
