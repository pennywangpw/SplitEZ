import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as groupsthunk from "../../store/group"
import { NavLink } from "react-router-dom";
import GroupModal from "../GroupModal"
import OpenModalButton from "../OpenModalButton";


function LeftPanel() {
    const dispatch = useDispatch()
    const allGroups = useSelector((state) => state.groups.allGroups);
    const allGroupsArr = Object.values(allGroups)
    console.log("ALL GROUPS: ", allGroupsArr)

    useEffect(() => {
        dispatch(groupsthunk.allGroupsthunk())
    }, [dispatch])

    return (
        <>

            <div className="panelborder">This is Left
                <div>Dashboard</div>
                <NavLink to="/all" style={{ textDecoration: 'none' }}>
                    <div>All expenses</div>
                </NavLink>
                <div className="flx">
                    <div className="width-50">GROUPS</div>
                    <div className="width-50">
                        <OpenModalButton
                            buttonText="+Add"
                            modalComponent={<GroupModal />}
                        />
                    </div>

                </div>
                <div>{allGroupsArr.map(group =>
                    <NavLink to={`/groups/${group.id}`} style={{ textDecoration: 'none' }}>
                        <div>{group.name}</div>
                    </NavLink>
                )}</div>
            </div >

        </>

    )
}

export default LeftPanel;
