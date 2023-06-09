import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as groupsthunk from "../../store/group";
import * as usersthunk from "../../store/user";
import { NavLink } from "react-router-dom";
import GroupModal from "../GroupModal";
import FriendModal from "../FriendModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal"
import OpenModalButton from "../OpenModalButton";


function LeftPanel() {
    const dispatch = useDispatch()
    const [currentGroupId, SetcurrentGroupId] = useState(1)
    const allGroups = useSelector((state) => state.groups.allGroups);
    const allGroupsArr = Object.values(allGroups)
    const allGroupsAndUsers = useSelector((state) => state.users.friendsWithGroupInfo)
    const allGroupsAndUsersArr = Object.values(allGroupsAndUsers)


    //get all group's names
    let groupsname = []
    for (let group of allGroupsArr) {
        groupsname.push(group.name)
    }


    //get all friends- change another thunk
    let friendsname = []
    for (let user of allGroupsAndUsersArr) {
        console.log("check user: ", user)
        //get valid friends who invole in groups
        for (let group of user.groupid) {
            if (groupsname.includes(group.name)) {
                friendsname.push(user)
            }
        }
    }

    // find unique friend's name
    let uniquefriendsname = [... new Set(friendsname)]



    useEffect(() => {
        dispatch(groupsthunk.allGroupsthunk())
        dispatch(usersthunk.friendsWithGroupInfo())
        // dispatch(usersthunk.allFriends())
        return () => dispatch(groupsthunk.clearGroupA())
    }, [dispatch])

    const friendsHandler = () => {
        alert("feature coming soon")
    }

    const clickFriendHandler = () => {
        console.log("clickFriendHandler")
        dispatch(usersthunk.friendsWithGroupInfo())
    }


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
                    <div>
                        {allGroupsArr.map(group =>
                            <div>
                                <NavLink to={`/groups/${group.id}`} style={{ textDecoration: 'none' }}>
                                    <div className="flx" >
                                        <div className="width-50" onClick={() => SetcurrentGroupId(group.id)}>
                                            {group.name}
                                        </div>
                                        <div className="width-50 flx-sa">
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
                        )}
                    </div>
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
                            modalComponent={<FriendModal type="create friend" />}
                        /> */}
                    </div>

                </div>

                <div className="height-3vh" id="frined">
                    <div>
                        {uniquefriendsname.map(user =>
                            <div className="friend" onClick={clickFriendHandler}>
                                {console.log("確認一下user: ", user)}
                                <NavLink to={`/friends/${user.id}`} style={{ textDecoration: 'none' }}>
                                    <div className="flx" >
                                        <div className="width-50" >
                                            {user.username}
                                        </div>
                                        <div className="width-50 flx-right">
                                            <OpenModalButton
                                                buttonText={<i class="fas fa-edit"></i>}
                                                modalComponent={<FriendModal name={user.username} id={user.id} type="edit friend" />}
                                            />
                                        </div>
                                    </div>
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>

            </div >

        </>

    )
}

export default LeftPanel;
