const GETALLFRIENDS = 'friends/ALL_FRIENDS';
const ADDFRIEND = 'friends/ADD_FRIEND';
const UPDATEFRIEND = 'friends/UPDATE_FRIENDS';


const allFriendsA = (arr) => {
    return {
        type: GETALLFRIENDS,
        arr
    };
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

//get all friends thunk
export const allFriendsthunk = () => async (dispatch) => {
    const response = await fetch("/api/friends/myfriends")

    if (response.ok) {
        const data = await response.json();
        dispatch(allFriendsA(data))
    };
    console.log("這裡是allFriends thunk", allFriendsthunk)
    return response
}

//add a friend thunk
export const addFriendthunk = (payload) => async (dispatch) => {
    console.log("這裡是addFriendthunk thunk payload", payload)

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
    console.log("this is thunk--updateFriendthunk", payload, typeof id, id)

    const response = await fetch(`/api/friends/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)

    })
    if (response.ok) {
        const data = await response.json();
        console.log("updateFriendthunk thunk check what i got from bk: ", data)
        dispatch(updateFriendA(data))
    };
    return response
}



const initialState = {
    allFriends: {}
};

const friendsReducer = (state = initialState, action) => {
    console.log("--friendsReducer with action: ", action)
    console.log("friendsReducer with action obj: ", action.obj)
    console.log("initial : ", state)
    switch (action.type) {
        case GETALLFRIENDS:
            let newState1 = { ...state, allFriends: { ...state.allFriends } }
            action.arr.forEach(friend => newState1.allFriends[friend.id] = friend)
            return newState1

        case ADDFRIEND:
            let newState2 = { ...state, allFriends: { ...state.allFriends } }
            let newfriend = action.obj
            newState2.allFriends[newfriend.id] = newfriend
            return newState2

        case UPDATEFRIEND:
            let newState3 = { ...state, allFriends: { ...state.allFriends } }
            let updatedfriend = action.obj
            newState3.allFriends[updatedfriend.id] = updatedfriend
            return newState3

        default:
            return state;
    }

};
export default friendsReducer;
