const GETALLFRIENDS = 'friends/ALL_FRIENDS';
const GETSINGLEFRIEND = 'friends/SINGLE_FRIEND';
const ADDFRIEND = 'friends/ADD_FRIEND';
const UPDATEFRIEND = 'friends/UPDATE_FRIENDS';
const DELETETAFRIEND = 'friends/DELETE_FRIENDS';
const CLEARSINGLEFRIEND = 'friends/CLEAR_GROUP';

export const clearSingleFriendA = () => {
    return {
        type: CLEARSINGLEFRIEND,
    };
};

const allFriendsA = (arr) => {
    return {
        type: GETALLFRIENDS,
        arr
    };
}

const singleFriendA = (obj) => {
    return {
        type: GETSINGLEFRIEND,
        obj
    }
}

const addFriendA = (obj) => {
    return {
        type: ADDFRIEND,
        obj
    };
}


const updateFriendA = (obj) => {
    return {
        type: UPDATEFRIEND,
        obj
    };
}


const deleteAFriendA = (obj) => {
    return {
        type: DELETETAFRIEND,
        obj
    }
}



//get all friends thunk
export const allFriendsthunk = () => async (dispatch) => {
    const response = await fetch("/api/friends/myfriends")

    if (response.ok) {
        const data = await response.json();
        dispatch(allFriendsA(data))
    };
    return response
}


//get single friend thunk
export const singleFriendthunk = (id) => async (dispatch) => {
    const response = await fetch(`/api/friends/${id}`)

    if (response.ok) {
        const data = await response.json();
        dispatch(singleFriendA(data))
    };
    return response
}

//add a friend thunk
export const addFriendthunk = (payload) => async (dispatch) => {

    const response = await fetch("/api/friends/", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })

    if (response.ok) {
        const data = await response.json();
        dispatch(addFriendA(data))
    }
    else {
        const errorData = await response.json();
        if (errorData && errorData.errors) {
            throw errorData.errors
        }
    }

}

//update friend thunk
export const updateFriendthunk = (payload, id) => async (dispatch) => {


    const response = await fetch(`/api/friends/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)

    })
    if (response.ok) {
        const data = await response.json();

        dispatch(updateFriendA(data))
    };
    return response
}

//delete friend thunk
export const deleteFriendthunk = (id) => async (dispatch) => {
    const response = await fetch(`/api/friends/${id}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        const data = await response.json();
        dispatch(deleteAFriendA(data))
    };
    return response

}

const initialState = {
    allFriends: {},
    singleFriend: {}
};

const friendsReducer = (state = initialState, action) => {
    console.log("--friendsReducer with action: ", action)
    console.log("friendsReducer with action obj: ", action.obj)
    console.log("initial : ", state)
    switch (action.type) {
        case GETALLFRIENDS:
            let newState1 = { ...state, allFriends: { ...state.allFriends }, singleFriend: { ...state.singleFriend } }
            action.arr.forEach(friend => newState1.allFriends[friend.id] = friend)
            return newState1

        case GETSINGLEFRIEND:
            let newState2 = { ...state, allFriends: { ...state.allFriends }, singleFriend: { ...state.singleFriend } }
            let selected_friend = action.obj
            newState2.singleFriend = selected_friend
            return newState2

        case ADDFRIEND:
            let newState3 = { ...state, allFriends: { ...state.allFriends }, singleFriend: { ...state.singleFriend } }
            let newfriend = action.obj
            newState3.allFriends[newfriend.id] = newfriend
            return newState3

        case UPDATEFRIEND:
            let newState4 = { ...state, allFriends: { ...state.allFriends }, singleFriend: { ...state.singleFriend } }
            let updatedfriend = action.obj
            newState4.allFriends[updatedfriend.id] = updatedfriend
            return newState4
        case DELETETAFRIEND:
            let newState5 = { ...state, allFriends: { ...state.allFriends }, singleFriend: { ...state.singleFriend } }
            let deletedfriend = action.obj
            delete newState5.allFriends[deletedfriend.id]
            return newState5
        case CLEARSINGLEFRIEND:
            let newState6 = { ...state, allFriends: { ...state.allFriends }, singleFriend: {} }

        default:
            return state;
    }

};
export default friendsReducer;
