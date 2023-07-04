const GETALLFRIENDS = 'friends/ALL_FRIENDS';
const GETAFRIENDWITHGROUPINFO = 'friends/FRIEND_WITH_GROUPINFO';



const allFriendsA = (arr) => {
    console.log("this is action creator--allFriendsA")

    return {
        type: GETALLFRIENDS,
        arr
    };
};

const allFriendsWithGroupInfo = (arr) => {
    return {
        type: GETAFRIENDWITHGROUPINFO,
        arr
    };
};


export const allFriends = () => async (dispatch) => {
    console.log("this is thunk--allFriends")
    const response = await fetch("/api/groups/");

    // const response = await fetch("/api/users/all");

    if (response.ok) {
        const data = await response.json();
        console.log("I FETCH BACKEND TO GET ALL USERS IN A DICTIONARY CHECK ", data)
        dispatch(allFriendsA(data));
    }
};


export const friendsWithGroupInfo = () => async (dispatch) => {
    const response = await fetch("/api/users/all")

    if (response.ok) {
        const data = await response.json();
        dispatch(allFriendsWithGroupInfo(data))
    }
}

//update friend thunk
export const updateFriendthunk = (payload) => async (dispatch) => {
    console.log("this is thunk--updateFriendthunk", payload)

    const response = await fetch(`/api/users`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)

    })
    if (response.ok) {
        const data = await response.json();
        console.log("updateFriendthunk thunk check what i got from bk: ", data)

    };
    return response
}

const initialState = {
    allGroupswithUserinfo: {},
    friendsWithGroupInfo: {}
};

const usersReducer = (state = initialState, action) => {
    console.log("usersReducer with action: ", action)
    console.log("usersReducer with action obj: ", action.obj)
    console.log("initial : ", state)

    switch (action.type) {
        case GETALLFRIENDS:
            let newState1 = { ...state, allGroupswithUserinfo: { ...state.allGroupswithUserinfo } };
            action.arr.forEach(user => newState1.allGroupswithUserinfo[user.id] = user);
            return newState1;

        case GETAFRIENDWITHGROUPINFO:
            let newState2 = { ...state, allGroupswithUserinfo: { ...state.allGroupswithUserinfo }, friendsWithGroupInfo: { ...state.friendsWithGroupInfo } };
            action.arr.forEach(user => newState2.friendsWithGroupInfo[user.id] = user);
            return newState2;

        default:
            return state;
    }
};

export default usersReducer;
