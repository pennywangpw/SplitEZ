const GETALLFRIENDS = 'friends/ALL_FRIENDS';

const allFriendsA = (arr) => {
    return {
        type: GETALLFRIENDS,
        arr
    };
}


//get all friends
export const allFriends = () => async (dispatch) => {
    const response = await fetch("/api/friends/myfriends")

    if (response.ok) {
        const data = await response.json();
        dispatch(allFriendsA(data))
    };
}


const initialState = {
    allFriends: {}
};

const friendsReducer = (state = initialState, action) => {
    console.log("--friendsReducer with action: ", action)
    console.log("friendsReducer with action obj: ", action.obj)
    console.log("initial : ", state)

}

export default friendsReducer;
