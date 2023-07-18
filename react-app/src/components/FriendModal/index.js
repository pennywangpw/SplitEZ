import React, { useEffect } from "react";
import { useModal } from "../../context/Modal";
import { useSelector, useDispatch } from 'react-redux';
import * as usersthunk from "../../store/user"
import { useState } from "react";




function FriendModal({ name, id, type }) {
    const dispatch = useDispatch()
    const { closeModal } = useModal()
    const [friendname, setFriendName] = useState(name)
    const [friendemail, setFriendemail] = useState()

    const [errors, setErrors] = useState([])

    // validation for group name
    useEffect(() => {
        let e = []
        if (friendname === undefined) e.push("Please provide friend's name")
        if (friendname !== undefined && friendname.length > 10) e.push("Please shorten the friend's name")
        if (friendemail === undefined) e.push("Please provide friend's email")

        setErrors(e)
    }, [friendname, friendemail])


    const handleSubmit = (e) => {
        e.preventDefault()
        let payload = { 'name': friendname, 'email': friendemail }
        console.log("按下load:去的pay ", payload)
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
                        {type === "create friend" ? (
                            <div>
                                <label htmlFor="friendname">
                                    Friend's email...
                                </label>
                                <input
                                    id="friendname"
                                    type="text"
                                    value={friendemail}
                                    onChange={(e) => setFriendemail(e.target.value)}
                                />
                            </div>
                        ) :
                            (
                                <div></div>
                            )}

                    </div>
                    <button className="button-decision" type="submit" disabled={errors.length > 0}>Yes</button>
                    <button className="button-decision" onClick={closeModal}>No</button>
                </div>
            </form>
        </>
    )
}

export default FriendModal;
