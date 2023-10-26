const GETALLFRIENDS = 'friends/ALL_FRIENDS';
const ADDFRIEND = 'friends/ADD_FRIEND';


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

//get all friends
export const allFriendsthunk = () => async (dispatch) => {
    const response = await fetch("/api/friends/myfriends")

    if (response.ok) {
        const data = await response.json();
        dispatch(allFriendsA(data))
    };
    console.log("這裡是allFriends thunk", allFriendsthunk)
    return response
}

//add a friend
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
    };
    console.log("這裡是allFriends thunk", allFriendsthunk)
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

        default:
            return state;
    }

};
export default friendsReducer;
