import React, { useEffect } from "react";
import { useModal } from "../../context/Modal";
import { useSelector, useDispatch } from 'react-redux';
import * as groupsthunk from "../../store/group"
import { useState } from "react";




function FriendModal({ name }) {
    const dispatch = useDispatch()
    const { closeModal } = useModal()
    const [friendname, setFriendName] = useState(name)
    const [errors, setErrors] = useState([])

    // validation for group name
    useEffect(() => {
        let e = []
        if (friendname === undefined) e.push("Please provide a group name")
        if (friendname !== undefined && friendname.length < 1) e.push("Please provide a group name.")
        if (friendname !== undefined && friendname.length > 10) e.push("Please shorten the group name")
        setErrors(e)
    }, [friendname])


    const handleSubmit = (e) => {
        e.preventDefault()
        let payload = { 'name': friendname }
        console.log("check typeof payload: ", payload)

    }



    return (
        <>
            <form onSubmit={handleSubmit} className="modal-group">
                <div className="width-350px height-350px">
                    <header className="bg-5cc5a7">Add description for friend's name</header>
                    {console.log("ooooo: ", errors)}
                    <div>
                        <div id="error">
                            {errors.length > 0 ? (errors.map(error => <div>{error}</div>)) : <div></div>}
                            {/* {errors.length > 0 && errors.map(error => <div>{error}</div>)} */}
                        </div>
                        <label htmlFor="friendname">
                            You may add description for friend's name
                        </label>
                        <input
                            id="friendname"
                            type="text"
                            value={friendname}
                            onChange={(e) => setFriendName(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={errors.length > 0}>Yes</button>
                    <button onClick={closeModal}>No</button>
                </div>
            </form>
        </>
    )
}

export default FriendModal;
