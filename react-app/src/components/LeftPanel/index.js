import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as groupsthunk from "../../store/group";
import * as usersthunk from "../../store/user";
import * as friendsthunk from "../../store/friend";
import { NavLink } from "react-router-dom";
import GroupModal from "../GroupModal";
import FriendModal from "../FriendModal";
import DeleteConfirmationModal from "../DeleteConfirmationModal"
import OpenModalButton from "../OpenModalButton";


function LeftPanel() {
    const dispatch = useDispatch()
    const [currentGroupId, SetcurrentGroupId] = useState(1)
    // const [renderchecker, setRenderchecker] = useState(0);
    const allGroups = useSelector((state) => state.groups.allGroups);
    const allGroupsArr = Object.values(allGroups)
    const current_user = useSelector((state) => state.session.user)
    const allFriends = useSelector((state) => state.friends.allFriends)
    const allFriendsArr = Object.values(allFriends)



    console.log("=====這裡是LeftPanel")

    console.log("here's allFriendsArr: ", allFriendsArr)


    //testing
    useEffect(() => {
        dispatch(groupsthunk.allGroupsthunk())
        // dispatch(usersthunk.allUsersWithGroupInfo())
        dispatch(friendsthunk.allFriendsthunk())

        return () => dispatch(groupsthunk.clearGroupA())
    }, [dispatch])



    // const updateFriendModal = () => {
    //     setRenderchecker((prevKey) => prevKey + 1);
    // };

    return (
        <>
            {console.log("是否有render???")}
            <div className=" pad-r-15px pad-l-10p ">
                <NavLink to="/all" style={{ textDecoration: 'none', lineHeight: '5vh' }}>
                    <div className="fontS-22px height-5vh">All expenses</div>
                </NavLink>
                <div className="flx bg-side-grey l-bar-c margin-bottom-5px">
                    <div className="width-50 ">GROUPS</div>
                    <div className="width-50">
                        <OpenModalButton
                            buttonText="+Add"
                            className=" float-r button-orange"
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
                                                className="button-decision pad-4-12"
                                                modalComponent={<GroupModal type="edit group" name={group.name} id={group.id} />}
                                            />
                                            <OpenModalButton
                                                buttonText={<i class="fas fa-trash-alt"></i>}
                                                className="button-decision pad-4-12"
                                                modalComponent={<DeleteConfirmationModal type="delete group" id={group.id} />}
                                            />
                                        </div>
                                    </div>


                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>


                <div className="flx bg-side-grey l-bar-c margin-bottom-5px">
                    <div className="width-50 ">FRIENDS</div>
                    <div className="width-50">
                        <OpenModalButton
                            buttonText="+Add"
                            className="float-r button-orange"
                            modalComponent={<FriendModal type="add friend" name="null" id="null" />}
                        />
                        {/* <button onClick={friendsHandler} className=" float-r button-orange">
                            +Add
                        </button> */}
                    </div>

                </div>

                <div className="height-3vh" id="frined">
                    <div>

                        {allFriendsArr.map(friend =>
                            <>
                                <div className="friend" >
                                    <NavLink to={`/${current_user.id}/friends/${friend.friend_id}`} style={{ textDecoration: 'none' }}>
                                        <div className="flx" >

                                            {friend.nickname !== null ? (
                                                <div className="width-50" >
                                                    {friend.friend_name}({friend.nickname})
                                                </div>
                                            )
                                                :
                                                (
                                                    <div className="width-50" >
                                                        {friend.friend_name}
                                                    </div>)
                                            }

                                            <div className="width-50 flx-sa">
                                                <OpenModalButton
                                                    buttonText={<i class="fas fa-edit"></i>}
                                                    className="button-decision pad-4-12"
                                                    modalComponent={<FriendModal name={friend.friend_name} email="null" id={friend.friend_id} type="edit friend" />}
                                                // updateFriendModal={updateFriendModal}
                                                />
                                                <OpenModalButton
                                                    buttonText={<i class="fas fa-trash-alt"></i>}
                                                    className="button-decision pad-4-12"
                                                    modalComponent={<DeleteConfirmationModal type="delete friend" id={friend.id} />}
                                                />
                                            </div>
                                        </div>
                                    </NavLink>
                                </div>
                            </>
                        )}
                    </div>
                </div>

            </div >

        </>

    )
}

export default LeftPanel;
