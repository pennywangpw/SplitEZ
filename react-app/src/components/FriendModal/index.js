import React, { useEffect } from "react";
import { useModal } from "../../context/Modal";
import { useSelector, useDispatch } from 'react-redux';
import * as usersthunk from "../../store/user"
import { useState } from "react";




function FriendModal({ name, id, type }) {
    const dispatch = useDispatch()
    const { closeModal } = useModal()
    const [friendname, setFriendName] = useState(name)
    const [errors, setErrors] = useState([])

    // validation for group name
    useEffect(() => {
        let e = []
        if (friendname === undefined) e.push("Please provide friend's name")
        if (friendname !== undefined && friendname.length > 10) e.push("Please shorten the friend's name")

        setErrors(e)
    }, [friendname])


    const handleSubmit = (e) => {
        e.preventDefault()
        let payload = { 'name': friendname }

        if (type === "create friend") {
            dispatch(usersthunk.createFriendthunk(payload)).then(closeModal)
        }
        else if (type === "edit friend") {
            dispatch(usersthunk.updateFriendthunk(payload, id)).then(dispatch(usersthunk.friendsWithGroupInfo())).then(closeModal())
        }

    }



    return (
        <>
            <form onSubmit={handleSubmit} className="modal-group">
                <div className="width-350px height-350px">
                    {type === "create friend" ? (<header className="bg-5cc5a7">Add a friend</header>) :
                        (<header className="bg-5cc5a7">Change friend's name</header>)}
                    {console.log("ooooo: ", errors)}
                    <div>
                        <div id="error">
                            {errors.length > 0 ? (errors.map(error => <div>{error}</div>)) : <div></div>}
                            {/* {errors.length > 0 && errors.map(error => <div>{error}</div>)} */}
                        </div>
                        {type === "create friend" ? (
                            <label htmlFor="friendname">
                                Friend's name...
                            </label>
                        ) :
                            (
                                <label htmlFor="friendname">
                                    You may change friend's name
                                </label>
                            )}

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
