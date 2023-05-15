const GETALLCOMMENTS = 'comments/ALL_COMMENTS';
const CLEARCOMMENT = 'comments/CLEAR_COMMENTS';
const CREATECOMMENT = 'comments/CREATE_COMMENTS';
const DELETECOMMENT = 'comments/DELETE_COMMENTS';
const UPDATECOMMENT = 'comments/UPDATE_COMMENTS';




//action creator
export const clearCommentA = () => {
    return {
        type: CLEARCOMMENT,
    };
};


export const allCommentsA = (arr, expenseId) => {
    console.log("this is action creator--get all comments")
    return {
        type: GETALLCOMMENTS,
        arr,
        expenseId
    }
}


export const createCommentsA = (obj) => {
    console.log("this is action creator--create comments")
    return {
        type: CREATECOMMENT,
        obj
    }
}



export const deleteCommentA = (obj) => {
    console.log("this is action creator--DELETE comments")
    return {
        type: DELETECOMMENT,
        obj
    }
}

export const updateCommentA = (obj) => {
    console.log("this is action creator--UPDATE comments")
    return {
        type: UPDATECOMMENT,
        obj
    }
}


//thunk
export const allComments = (expenseId) => async (dispatch) => {
    console.log("all comments thunk is working")
    console.log("---this is comments thunk with expenseId: ", expenseId)
    const response = await fetch(`/api/comments/${expenseId}/allcomments`)

    if (response.ok) {
        const data = await response.json()
        console.log("=====this is comments thunk with data:==== ", expenseId, data)

        dispatch(allCommentsA(data, expenseId))
    }
}

export const createComments = (payload) => async (dispatch) => {
    console.log("這裡是createcomment的payload: ", payload, typeof payload.expenseId)
    const response = await fetch(`/api/comments/${payload.expenseId}/allcomments`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
    })

    if (response.ok) {
        const data = await response.json()

        dispatch(createCommentsA(data))
    }
}


export const deleteComments = (commentId) => async (dispatch) => {
    console.log("check what i passed in delete comment thunk: ", commentId)
    const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        console.log("有ok嗎")
        const data = await response.json();
        dispatch(deleteCommentA(data));
    };
    return response
}



export const updateComments = (commentId) => async (dispatch) => {
    console.log("check what i passed in delete comment thunk: ", commentId)
    const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT'
    })
    if (response.ok) {
        const data = await response.json();
        dispatch(updateCommentA(data));
    };
    return response
}



const initialState = {
    allComments: {},
    singleComment: {}
}

//Reducer
const commentsReducer = (state = initialState, action) => {
    console.log("commentsReducer with action: ", action)
    console.log("commentsReducer with action obj: ", action.obj)
    console.log("commentsReducer with action arr: ", action.expenseId, action.arr)

    console.log("initial : ", state)

    switch (action.type) {
        case GETALLCOMMENTS:
            let newState1 = { allComments: { ...state.allComments }, singleComment: {} };
            console.log("newstate1 copy: ", newState1)
            action.arr.forEach(comment => console.log("到底有幾個comment: ", comment))

            action.arr.forEach(comment => newState1.allComments[comment.id] = comment)
            console.log("最後在store: ", newState1)
            return newState1;

        case CLEARCOMMENT:
            let newState2 = { allComments: { ...state.allComments }, singleComment: { ...state.singleComment } }
            newState2.allComments = {}
            return newState2

        case CREATECOMMENT:
            let newState3 = { ...state, allComments: { ...state.allComments }, singleComment: { ...state.singleComment } };
            let newComment = action.obj
            newState3.allComments[newComment.id] = newComment

            return newState3

        case DELETECOMMENT:
            let newState4 = { ...state, allComments: { ...state.allComments }, singleComment: { ...state.singleComment } };
            let deletedComment = action.obj.id
            delete newState4.allComments[deletedComment]
            return newState4

        case UPDATECOMMENT:
            let newState5 = { ...state, allComments: { ...state.allComments }, singleComment: { ...state.singleComment } };
            let updatedComment = action.obj
            newState5.allComments[updatedComment.id] = updatedComment
            return newState5
        default:
            return state;
    }
};

export default commentsReducer;
