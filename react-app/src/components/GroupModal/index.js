import React from "react";
import { useModal } from "../../context/Modal";
import { useSelector, useDispatch } from 'react-redux';
import * as groupsthunk from "../../store/group"
import { useState } from "react";




function GroupModal({ type, name, id }) {
    console.log("In the group modal what i got the name i passed in: ", type, name, id)
    const dispatch = useDispatch()
    const { closeModal } = useModal()
    const [groupname, setGroupName] = useState(name)

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("add a group is working")
        let payload = { 'name': groupname }
        console.log("check typeof payload: ", payload)

        if (type === "create group") {
            dispatch(groupsthunk.createGroupthunk(payload)).then(closeModal)
        }
        else if (type === "edit group") {
            dispatch(groupsthunk.updateGroupthunk(payload, id)).then(closeModal)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="width-350px height-350px">
                    {type === "create group" ? (<header className="bg-5cc5a7">Add an group</header>) :
                        (<header className="bg-5cc5a7">Rename the group</header>)}
                    <div>
                        My group shall be called...
                        <input
                            type="text"
                            placeholder="1600 Pennsylvania Ave"
                            value={groupname}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    </div>
                    <button type="submit">Yes</button>
                    <button onClick={closeModal}>No</button>
                </div>
            </form>
        </>
    )
}

export default GroupModal;
