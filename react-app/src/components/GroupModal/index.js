import React from "react";
import { useModal } from "../../context/Modal";
import { useSelector, useDispatch } from 'react-redux';
import * as groupsthunk from "../../store/group"
import { useState } from "react";




function GroupModal() {
    const dispatch = useDispatch()
    const { closeModal } = useModal()
    const [groupname, setGroupName] = useState("")

    const createhandler = () => {
        console.log("test")
        // let payload = { groupname }
        // console.log("check typeof payload: ", payload)
        // dispatch(groupsthunk.createGroupthunk(payload)).then(closeModal)
    }

    return (
        <>
            <form>
                <div className="width-350px height-350px">
                    <header className="bg-5cc5a7">
                        Add an group
                    </header>
                    <div>
                        My group shall be called...
                        <input
                            type="text"
                            placeholder="1600 Pennsylvania Ave"
                            value={groupname}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                    </div>
                    <button onClick={createhandler}>Yes</button>
                    <button onClick={closeModal}>No</button>
                </div>
            </form>
        </>
    )
}

export default GroupModal;
