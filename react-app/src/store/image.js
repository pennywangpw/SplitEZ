const ADDANIMAGE = 'images/ADD_IMAGE';


const addAnImageA = (obj) => {
    return {
        type: ADDANIMAGE,
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
        console.log("是不是沒有data", data)
        dispatch(addAnImageA(data))
    }
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
        default:
            return state;
    }
};

export default imagesReducer;
