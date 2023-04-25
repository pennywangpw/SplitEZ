const GETALLGROUPS = 'groups/ALL_GROUP';
const POSTAGROUP = 'groups/CREATE_GROUP';

//action creator
const allGroupsA = (arr) => {
    console.log("this is action creator--allGroupsA")

    return {
        type: GETALLGROUPS,
        arr
    };
};

const createAGroupsA = (obj) => {
    console.log("this is action creator--createAGroupsA")

    return {
        type: POSTAGROUP,
        obj
    };
}


//get all groups thunk
export const allGroupsthunk = () => async (dispatch) => {
    console.log("this is thunk--get all groups")
    const response = await fetch(`/api/groups/all`)
    if (response.ok) {
        const data = await response.json();
        console.log("allGroups thunk check what i got from bk: ", data)
        dispatch(allGroupsA(data));
    };
    return response
};

//create group thunk
export const createGroupthunk = (payload) => async (dispatch) => {
    console.log("this is thunk--createGroupthunk", payload)
    const response = await fetch(`/api/groups`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)

    })
    if (response.ok) {
        const data = await response.json();
        console.log("allGroups thunk check what i got from bk: ", data)
        dispatch(createAGroupsA(data));
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

        case POSTAGROUP:
            let newState2 = { allGroups: { ...state.allGroups }, singleGroup: {} };
            let newGroup = action.obj
            newState2.allGroups[newGroup.id] = newGroup
            return newState2

        default:
            return state;
    }
};

export default groupsReducer;
