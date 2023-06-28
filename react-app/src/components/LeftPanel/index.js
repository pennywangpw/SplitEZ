import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as groupsthunk from "../../store/group";
import * as usersthunk from "../../store/user";
import { NavLink } from "react-router-dom";
import GroupModal from "../GroupModal"
import DeleteConfirmationModal from "../DeleteConfirmationModal"
import OpenModalButton from "../OpenModalButton";


function LeftPanel() {
    const dispatch = useDispatch()
    const [currentGroupId, SetcurrentGroupId] = useState(1)
    const allGroups = useSelector((state) => state.groups.allGroups);
    const allGroupsArr = Object.values(allGroups)
    const allGroupsAndUsers = useSelector((state) => state.groupswithusers.allGroupswithUserinfo)


    //get all friends
    const allGroupsAndUsersArr = Object.values(allGroupsAndUsers)
    let friendsname = []
    for (let user of allGroupsAndUsersArr) {
        user.userinfo.forEach(user => friendsname.push(user.username))
    }


    //find unique friend's name
    let uniquefriendsname = [... new Set(friendsname)]


    useEffect(() => {
        dispatch(groupsthunk.allGroupsthunk())
        dispatch(usersthunk.allFriends())
        return () => dispatch(groupsthunk.clearGroupA())

    }, [dispatch])

    const friendsHandler = () => {
        alert("feature coming soon")
    }

    const clickFriendHandler = () => {
        console.log("clickFriendHandler")
        dispatch(usersthunk.friendsWithGroupInfo())
    }

    // useEffect(() => {
    //     dispatch(groupsthunk.allGroupsthunk())
    //     dispatch(groupsthunk.singleGroupthunk(currentGroupId))

    // }, [dispatch, currentGroupId])

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

            <div className=" pad-r-15px mrg-l-10px ">
                <NavLink to="/all" style={{ textDecoration: 'none', lineHeight: '5vh' }}>
                    <div className="fontS-22px height-5vh">All expenses</div>
                </NavLink>
                <div className="flx bg-side-grey l-bar-c">
                    <div className="width-50 ">GROUPS</div>
                    <div className="width-50">
                        <OpenModalButton
                            buttonText="+Add"
                            className=" float-r button"
                            modalComponent={<GroupModal type="create group" />}
                        />
                    </div>

                </div>

                <div id="group">
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


                <div className="flx bg-side-grey l-bar-c">
                    <div className="width-50 ">FRIENDS</div>
                    <div className="width-50">
                        <button onClick={friendsHandler} className=" float-r button">
                            +Add
                        </button>
                        {/* <OpenModalButton

                            buttonText="+Add"
                            className=" float-r button"
                            modalComponent={<GroupModal type="create group" />}
                        /> */}
                    </div>

                </div>
                <div className="height-3vh" id="frined">
                    <div>
                        {uniquefriendsname.map(name => <div className="friend" onClick={clickFriendHandler}>{name}</div>)}

                    </div>
                </div>
            </div >

        </>

    )
}

export default LeftPanel;
