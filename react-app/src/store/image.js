const ADDANIMAGE = 'images/ADD_IMAGE';
const GETSINGLEIMAGE ='images/SINGLE_IMAGE';


const addAnImageA = (obj) => {
    return {
        type: ADDANIMAGE,
        obj
    };
}


const singleImageA = (obj) => {
    return {
        type: GETSINGLEIMAGE,
        obj
    };
}



//add a image
export const addImagethunk = (formData) => async (dispatch) => {
    console.log("this is thunk--addImagethunk", formData)

    const response = await fetch(`/api/images/all`, {
        method: 'POST',
        // headers: {
        //     "Content-Type": "application/json",
        // },
        body: formData
    })
    if (response.ok) {
        const {data} = await response.json();
        dispatch(addAnImageA(data))
    }
    return response
}


//get a image
export const singleImagethunk = (id) => async (dispatch) => {
    const response = await fetch(`/api/images/${id}`)

    if (response.ok) {
        const data = await response.json();
        dispatch(singleImageA(data))
    };
    return response
}

const initialState = {
    singleImage: {}
};


const imagesReducer = (state = initialState, action) => {
    console.log("--imagesReducer with action: ", action)
    console.log("imagesReducer with action obj: ", action.obj)
    console.log("initial : ", state)

    switch (action.type) {
        case ADDANIMAGE:
            let newState1 = { ...state, singleImage: { ...state.singleImage } }
            let added_image = action.obj
            newState1.singleImage[added_image.id] = added_image
            return newState1

        case GETSINGLEIMAGE:
            let newState2 = { ...state, singleImage: { ...state.singleImage } }
            newState2.singleImage[action.obj.id] = action.obj
            return newState2

        default:
            return state;
    }
};

export default imagesReducer;
