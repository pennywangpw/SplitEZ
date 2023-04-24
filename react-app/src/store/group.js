const GETALLGROUPS = 'expenses/ALL_GROUP';

//action creator
const allGroupsA = (arr) => {
    console.log("this is action creator--allGroupsA")

    return {
        type: GETALLGROUPS,
        arr
    };
};


//get all groups thunk
export const allGroups = () => async (dispatch) => {
    console.log("this is thunk--get all groups")
    const response = await fetch(`/api/expenses/all`)
    if (response.ok) {
        const data = await response.json();
        console.log("allGroups thunk check what i got from bk: ", data)
        dispatch(allGroupsA(data));
    };
    return response
};


const initialState = {
    allGroups: {},
    singleGroup: {}
};

const groupsReducer = (state = initialState, action) => {
    console.log("groupsReducer with action: ", action)
    console.log("groupsReducer with action obj: ", action.obj)
    console.log("initial : ", state)

    switch (action.type) {
        case GETALLGROUPS:
            let newState1 = { allGroups: { ...state.allGroups }, singleGroup: {} };
            action.arr.forEach(group => newState1.allGroups[group.id] = group);
            return newState1;



        default:
            return state;
    }
};

export default groupsReducer;
