import React, { useEffect } from "react";
import { useModal } from "../../context/Modal";
import { useSelector, useDispatch } from 'react-redux';
import * as groupsthunk from "../../store/group"
import { useState } from "react";




function GroupModal({ type, name, id }) {
    console.log("In the group modal what i got the name i passed in: ", type, name, id)
    const dispatch = useDispatch()
    const { closeModal } = useModal()
    const [groupname, setGroupName] = useState(name)
    const [errors, setErrors] = useState([])

    // validation for group name
    useEffect(() => {
        let e = []
        if (groupname === undefined) e.push("Please provide a group name")
        if (groupname !== undefined && groupname.length < 1) e.push("Please provide a group name.")
        if (groupname !== undefined && groupname.length > 10) e.push("Please shorten the group name")
        setErrors(e)
    }, [groupname])


    const handleSubmit = (e) => {
        e.preventDefault()
        let payload = { 'name': groupname }
        console.log("check typeof payload: ", payload)

        if (type === "create group") {
            dispatch(groupsthunk.createGroupthunk(payload)).then(closeModal)
        }
        else if (type === "edit group") {
            dispatch(groupsthunk.updateGroupthunk(payload, id)).then(dispatch(groupsthunk.singleGroupthunk(id))).then(closeModal)
        }
    }



    return (
        <>
            <form onSubmit={handleSubmit} className="modal-group">
                <div className="width-350px height-350px">
                    {type === "create group" ? (<header className="bg-5cc5a7">Add an group</header>) :
                        (<header className="bg-5cc5a7">Rename the group</header>)}
                    <div>
                        <div id="error">
                            {errors.length > 0 ? (errors.map(error => <div>{error}</div>)) : <div></div>}
                            {/* {errors.length > 0 && errors.map(error => <div>{error}</div>)} */}
                        </div>
                        <label htmlFor="groupname">
                            My group shall be called...
                        </label>
                        <input
                            id="groupname"
                            type="text"
                            placeholder="1600 Pennsylvania Ave"
                            value={groupname}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    </div>
                    <button className="button-decision" type="submit" disabled={errors.length > 0}>Yes</button>
                    <button className="button-decision" onClick={closeModal}>No</button>
                </div>
            </form>
        </>
    )
}

export default GroupModal;
