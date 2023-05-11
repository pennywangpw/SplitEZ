const GETALLFRIENDS = 'friends/ALL_FRIENDS';


const allFriendsA = (arr) => {
    console.log("this is action creator--allFriendsA")

    return {
        type: GETALLGROUPS,
        arr
    };
};

export const allFriends = () => async (dispatch) => {
    const response = await fetch("/api/users/all", {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        dispatch(allFriendsA());
    }
};


const initialState = {
    allUsers: {}
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
