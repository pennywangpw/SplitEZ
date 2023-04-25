const GETALLGROUPS = 'groups/ALL_GROUP';
const POSTAGROUP = 'groups/CREATE_GROUP';
const UPDATEGROUP = 'groups/UPDATE_GROUP';
const DELETETAGROUP = 'groups/DELETE_GROUP';


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

const updateAGroupsA = (obj) => {
    console.log("this is action creator--updateAGroupsA")

    return {
        type: UPDATEGROUP,
        obj
    };
}


const deleteAGroupsA = (obj) => {
    console.log("this is action creator--deleteAGroupsA")

    return {
        type: DELETETAGROUP,
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


//update group thunk
export const updateGroupthunk = (payload, id) => async (dispatch) => {
    console.log("this is thunk--updateGroupthunk", payload, typeof id, id)
    const response = await fetch(`/api/groups/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)

    })
    if (response.ok) {
        const data = await response.json();
        console.log("allGroups thunk check what i got from bk: ", data)
        dispatch(updateAGroupsA(data));
    };
    return response
};

//delete group thunk
export const deleteGroupthunk = (id) => async (dispatch) => {
    console.log("this is thunk--deleteGroupthunk")
    const response = await fetch(`/api/groups/${id}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        const data = await response.json();
        console.log("DELETE allGroups thunk check what i got from bk: ", data)
        dispatch(deleteAGroupsA(data));
    };
    return response

}

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

        case UPDATEGROUP:
            let newState3 = { allGroups: { ...state.allGroups }, singleGroup: {} };
            let updatedGroup = action.obj
            newState3.allGroups[updatedGroup.id] = updatedGroup
            return newState3
        case DELETETAGROUP:
            let newState4 = { allGroups: { ...state.allGroups }, singleGroup: {} };
            let deletedGroup = action.obj.id
            delete newState4.allGroups[deletedGroup]
            return newState4

        default:
            return state;
    }
};

export default groupsReducer;
