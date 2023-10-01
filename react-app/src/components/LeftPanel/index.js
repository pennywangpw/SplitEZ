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
    const allGroupsAndUsers = useSelector((state) => state.users.allUsersWithGroupInfo)
    const allGroupsAndUsersArr = Object.values(allGroupsAndUsers)
    // const allGroupsAndFriends = useSelector((state) => state.users.allFriendsWithGroupInfo)
    // const allGroupsAndFriendsArr = Object.values(allGroupsAndFriends)

    console.log("here's allGroupsAndUsersArr: ", allGroupsAndUsersArr)
    // console.log("*****here's allGroupsAndFriendsArr: ", allGroupsAndFriendsArr)

    //重新整理
    // useEffect(() => {
    //     dispatch(groupsthunk.allGroupsthunk())
    //     return () => dispatch(groupsthunk.clearGroupA())
    // }, [dispatch])

    //testing
    useEffect(() => {
        dispatch(groupsthunk.allGroupsthunk())
        dispatch(usersthunk.allUsersWithGroupInfo())
        // dispatch(usersthunk.allFriendsWithGroupInfo())

        return () => dispatch(groupsthunk.clearGroupA())
    }, [])


    // //get all friends' name
    // let friends = []
    // for (let group of allGroupsArr) {
    //     console.log("group: ", group)
    //     for (let user of group["group_members"]) {
    //         if (!friends.includes(user)) {
    //             friends.push(user)
    //         }
    //     }
    // }
    // console.log("check up friends :", friends)

    // // find unique friend's name
    // const uniquefriend = new Set()

    // for (let friend of friends) {
    //     console.log("each friend: ", friend)
    //     // convert value to a JSON string
    //     const friendString = JSON.stringify(friend)
    //     if (!uniquefriend.has(friendString)) {
    //         uniquefriend.add(friendString)
    //     }
    // }

    // //convert uniquefriend to array
    // const uniquefriendArr = [...uniquefriend]

    // //convert the value in array into object
    // const uniquefriendObj = uniquefriendArr.map(friendString => JSON.parse(friendString))


    const friendsHandler = () => {
        // alert("feature coming soon")
        // let payload = { 'name': username }
        // dispatch(usersthunk.addFriendthunk(payload))
        console.log("5555")
    }

    // const clickFriendHandler = (user_id) => {

    //     console.log("clickFriendHandler user id 查看", user_id)

    // }


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


                <div className="flx bg-side-grey l-bar-c">
                    <div className="width-50 ">FRIENDS</div>
                    <div className="width-50">
                        <OpenModalButton
                            buttonText="+Add"
                            className="float-r button-orange"
                            modalComponent={<FriendModal type="create friend" name="" id="null" />}
                        />
                        {/* <button onClick={friendsHandler} className=" float-r button-orange">
                            +Add
                        </button> */}
                    </div>

                </div>

                <div className="height-3vh" id="frined">
                    <div>
                        {allGroupsAndUsersArr.map(user =>
                            <>
                                {console.log("user 在這裡", user)}
                                <div className="friend" >
                                    <NavLink to={`/friends/${user.id}`} style={{ textDecoration: 'none' }}>
                                        <div className="flx" >
                                            <div className="width-50" >
                                                {user.username}
                                            </div>
                                            <div className="width-50 flx-right">
                                                <OpenModalButton
                                                    buttonText={<i class="fas fa-edit"></i>}
                                                    className="button-decision pad-4-12"
                                                    modalComponent={<FriendModal name={user.username} id={user.id} email={user.email} type="edit friend" />}
                                                />
                                            </div>
                                            <OpenModalButton
                                                buttonText={<i class="fas fa-trash-alt"></i>}
                                                className="button-decision pad-4-12"
                                                modalComponent={<DeleteConfirmationModal type="delete friend" id={user.id} />}
                                            />
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
