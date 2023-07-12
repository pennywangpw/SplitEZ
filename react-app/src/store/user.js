const GETALLFRIENDS = 'friends/ALL_FRIENDS';
const GETAFRIENDWITHGROUPINFO = 'friends/FRIEND_WITH_GROUPINFO';
const UPDATEFRIEND = 'friends/UPDATE_FRIENDS';
const POSTAFRIEND = 'friends/CREATE_FRIEND';



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

const updateFriendA = (obj) => {
    return {
        type: UPDATEFRIEND,
        obj
    };
}


const createAFriendA = (obj) => {
    return {
        type: POSTAFRIEND,
        obj
    };
}

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
export const updateFriendthunk = (payload, id) => async (dispatch) => {
    console.log("this is thunk--updateFriendthunk", payload, typeof id, id)

    const response = await fetch(`/api/users/${id}`, {
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

//create friend thunk
export const createFriendthunk = (payload) => async (dispatch) => {
    console.log("createFriendthunk payload: ", payload)
    const response = await fetch(`/api/users`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })
    if (response.ok) {
        const data = await response.json();
        dispatch(createAFriendA(data))
    }
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
            console.log("action.arr: ", action.arr)
            action.arr.forEach(user => newState2.friendsWithGroupInfo[user.id] = user);
            return newState2;
        case UPDATEFRIEND:
            let newState3 = { ...state, allGroupswithUserinfo: { ...state.allGroupswithUserinfo }, friendsWithGroupInfo: { ...state.friendsWithGroupInfo } }
            let updatedFriend = action.obj
            newState3.friendsWithGroupInfo = updatedFriend
            return newState3
        case POSTAFRIEND:
            let newState4 = { ...state, allGroupswithUserinfo: { ...state.allGroupswithUserinfo }, friendsWithGroupInfo: { ...state.friendsWithGroupInfo } }
            let newfriend = action.obj
            newState4.friendsWithGroupInfo[newfriend.id] = newfriend
            return newState4
        default:
            return state;
    }
};

export default usersReducer;
