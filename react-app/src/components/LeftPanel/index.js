import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as groupsthunk from "../../store/group"
import { NavLink, useParams } from "react-router-dom";
import GroupModal from "../GroupModal"
import DeleteConfirmationModal from "../DeleteConfirmationModal"
import OpenModalButton from "../OpenModalButton";



function LeftPanel() {
    const dispatch = useDispatch()
    // let { groupId } = useParams()
    const [currentGroupId, SetcurrentGroupId] = useState(0)
    const allGroups = useSelector((state) => state.groups.allGroups);
    const allGroupsArr = Object.values(allGroups)
    // console.log("--------groupId from params: ", groupId)
    // console.log("--------groupId from state: ", currentGroupId)


    console.log("ALL GROUPS: ", allGroupsArr)

    useEffect(() => {
        dispatch(groupsthunk.allGroupsthunk())
        dispatch(groupsthunk.singleGroupthunk(currentGroupId))

    }, [dispatch, currentGroupId])

    // const singlegrouphandler = () => {
    //     console.log("clicking ")
    //     SetcurrentGroupId(groupId)
    //     console.log("--------groupId from state in handler: ", currentGroupId)
    //     dispatch(groupsthunk.singleGroupthunk(groupId))
    // }

    // const singlegrouphandler = () => {
    //     console.log("clicking ")
    //     SetcurrentGroupId(groupId)
    //     console.log("--------groupId from state in handler: ", currentGroupId)
    //     dispatch(groupsthunk.singleGroupthunk(groupId))
    // }

    // if (allGroupsArr.length === 0) return null

    return (
        <>

            <div className="panelborder">
                <NavLink to="/all" style={{ textDecoration: 'none' }}>
                    <div>All expenses</div>
                </NavLink>
                <div className="flx height-5vh">
                    <div className="width-50">GROUPS</div>
                    <div className="width-50">
                        <OpenModalButton
                            buttonText="+Add"
                            modalComponent={<GroupModal type="create group" />}
                        />
                    </div>

                </div>
                <div className="height-3vh">
                    <div>{allGroupsArr.map(group =>
                        <div>
                            <NavLink to={`/groups/${group.id}`} style={{ textDecoration: 'none' }}>
                                <div className="flx" >
                                    <div className="width-50" onClick={() => SetcurrentGroupId(group.id)}>
                                        {group.name}
                                    </div>
                                    <div className="width-50 flx-spacearound">
                                        <OpenModalButton
                                            buttonText={<i class="fas fa-edit"></i>}
                                            modalComponent={<GroupModal type="edit group" name={group.name} id={group.id} />}
                                        />
                                        <OpenModalButton
                                            buttonText={<i class="fas fa-trash-alt"></i>}
                                            modalComponent={<DeleteConfirmationModal type="delete group" groupid={group.id} />}
                                        />
                                    </div>
                                </div>


                            </NavLink>
                        </div>
                    )}</div>
                </div>
            </div >

        </>

    )
}

export default LeftPanel;
