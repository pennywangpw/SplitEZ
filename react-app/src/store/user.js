// const GETALLFRIENDS = 'friends/ALL_FRIENDS';
const GETAFRIEND = 'friends/SINGLE_FRIEND';
const GETALLUSERSWITHGROUPINFO = 'friends/ALL_USERS_WITH_GROUPINFO';
const GETALLFRIENDSWITHGROUPINFO = 'friends/ALL_FRIENDS_WITH_GROUPINFO';
const UPDATEFRIEND = 'friends/UPDATE_FRIENDS';
const ADDAFRIEND = 'friends/ADD_FRIEND';
const GETUSERS = 'friends/ALL_USERS';






// const allFriendsA = (arr) => {
//     console.log("this is action creator--allFriendsA")

//     return {
//         type: GETALLFRIENDS,
//         arr
//     };
// };

const singleFriend = (obj) => {
    console.log("this is action creator--singleFriend")

    return {
        type: GETAFRIEND,
        obj
    };
};

const allUsersA = (obj) => {
    console.log("尋找this is action creator--all user", obj)

    return {
        type: GETUSERS,
        obj
    };
};


const allUsersWithGroupInfoA = (arr) => {
    return {
        type: GETALLUSERSWITHGROUPINFO,
        arr
    };
};

const allFriendsWithGroupInfoA = (arr) => {
    return {
        type: GETALLFRIENDSWITHGROUPINFO,
        arr
    };
}
const updateFriendA = (obj) => {
    return {
        type: UPDATEFRIEND,
        obj
    };
}



const addAFriendA = (obj) => {
    return {
        type: ADDAFRIEND,
        obj
    };
}


//get all users
export const allUsers = () => async (dispatch) => {
    const response = await fetch("/api/users/")

    if (response.ok) {
        const data = await response.json();
        dispatch(allUsersA(data))
    };
}




//get all users with group info thunk
export const allUsersWithGroupInfo = () => async (dispatch) => {
    const response = await fetch("/api/users/all")

    if (response.ok) {
        const data = await response.json();
        dispatch(allUsersWithGroupInfoA(data))
    };
}

//get all friends with group info thunk
export const allFriendsWithGroupInfo = () => async (dispatch) => {
    const response = await fetch("/api/users/myfriends")

    if (response.ok) {
        const data = await response.json();
        dispatch(allFriendsWithGroupInfoA(data))
    };
}



//get singleFriend thunk
export const getAfFriend = (id) => async (dispatch) => {
    const response = await fetch(`/api/users/${id}`)
    if (response.ok) {
        const data = await response.json()
        dispatch(singleFriend(data))
    }
    return response
}

//update friend thunk
export const updateUserthunk = (payload, id) => async (dispatch) => {
    console.log("this is thunk--updateUserthunk", payload, typeof id, id)

    const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)

    })
    if (response.ok) {
        const data = await response.json();
        console.log("updateUserthunk thunk check what i got from bk: ", data)
        dispatch(updateFriendA(data))
    };
    return response
}


//add a friend on LeftPanel thunk
export const addFriendthunk = (payload) => async (dispatch) => {
    console.log("addFriendthunk payload: ", payload)
    const response = await fetch(`/api/users/add-a-friend`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })
    if (response.ok) {
        const data = await response.json();
        dispatch(addAFriendA(data))
    }
    return response
}


const initialState = {
    allusers: {},
    allUsersWithGroupInfo: {},
    allFriendsWithGroupInfo: {},
    singleFriend: {}
};

const usersReducer = (state = initialState, action) => {
    console.log("--usersReducer with action: ", action)
    console.log("usersReducer with action obj: ", action.obj)
    console.log("initial : ", state)

    switch (action.type) {
        // case GETALLFRIENDS:
        //     let newState1 = { ...state, allGroupswithUserinfo: { ...state.allGroupswithUserinfo } };
        //     action.arr.forEach(user => newState1.allGroupswithUserinfo[user.id] = user);
        //     return newState1;

        case GETUSERS:
            let newState1 = { ...state, allusers: { ...state.allusers } }
            action.obj.users.forEach(user => newState1.allusers[user.id] = user)
            return newState1

        case GETALLUSERSWITHGROUPINFO:
            let newState2 = { ...state, allusers: { ...state.allusers }, allUsersWithGroupInfo: { ...state.allUsersWithGroupInfo }, allFriendsWithGroupInfo: { ...state.allFriendsWithGroupInfo }, singleFriend: { ...state.singleFriend } };
            let idx = 0
            action.arr.forEach(user => {
                newState2.allUsersWithGroupInfo[idx] = user
                idx += 1
            }
            )
            // action.arr.forEach(user => newState2.allUsersWithGroupInfo[user.id] = user);
            return newState2;

        case UPDATEFRIEND:
            let newState3 = { ...state, allusers: { ...state.allusers }, allUsersWithGroupInfo: { ...state.allUsersWithGroupInfo } }
            let updatedFriend = action.obj
            newState3.allUsersWithGroupInfo[updatedFriend.id] = updatedFriend
            return newState3


        case GETAFRIEND:
            let newState5 = { ...state, singleFriend: { ...state.singleFriend } };
            let selectedFriend = action.obj
            newState5.singleFriend = selectedFriend
            return newState5;

        case ADDAFRIEND:
            let newState6 = { ...state, allusers: { ...state.allusers }, allUsersWithGroupInfo: { ...state.allUsersWithGroupInfo } }
            let added_friend = action.obj
            newState6.allUsersWithGroupInfo[added_friend.id] = added_friend
            return newState6

        case GETALLFRIENDSWITHGROUPINFO:
            let newState7 = { ...state, allusers: { ...state.allusers }, allUsersWithGroupInfo: { ...state.allUsersWithGroupInfo }, allFriendsWithGroupInfo: { ...state.allFriendsWithGroupInfo }, singleFriend: { ...state.singleFriend } };
            let index = 0
            action.arr.forEach(user => {
                newState7.allFriendsWithGroupInfo[index] = user
                index += 1
            }
            )
            return newState7;


        default:
            return state;
    }
};

export default usersReducer;
