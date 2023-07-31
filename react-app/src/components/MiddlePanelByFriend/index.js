import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import OpenModalButton from "../OpenModalButton";
import CreateExpense from "../CreateExpense";
import * as usersthunk from "../../store/user";




function GroupListByFriend() {
    let { friendId } = useParams()
    const dispatch = useDispatch()

    const allGroupsAndUsers = useSelector((state) => state.users.friendsWithGroupInfo)
    const allGroupsAndUsersArr = Object.values(allGroupsAndUsers)
    const allGroups = useSelector((state) => state.groups.allGroups);
    const allGroupsArr = Object.values(allGroups)

    // //check if there're 2 friendswithgroupinfo fetch
    // useEffect(() => {
    //     dispatch(usersthunk.friendsWithGroupInfo())
    // }, [])

    //get all group's names
    let groupsname = []
    for (let group of allGroupsArr) {
        groupsname.push(group.name)
    }

    //choose the selected frined in allusers
    let selectedFriend
    if (allGroupsAndUsersArr.length > 0) {
        selectedFriend = allGroupsAndUsers[friendId]
    }


    //dispaly valid groups in middle panel, user can only see the groups he/she involes
    let validgroup = []
    if (selectedFriend) {
        if (selectedFriend.groupid) {
            validgroup = selectedFriend.groupid.filter(group => groupsname.includes(group.name))
        }

    }

    return (
        <>
            <div className="shadow">

                <div className="flx line-h70 bg-maim-eee border-top-main border-bottom-main fontS-13px ">
                    {selectedFriend ? (<div className="fontS-220rem width-50">{selectedFriend.username}</div>) : (<div></div>)

                    }

                    {/* <div className="fontS-220rem width-50">{selectedFriend.username}</div> */}
                    <div className="btn-create">
                        <OpenModalButton
                            className={"button-orange"}
                            buttonText="Add an expense"
                            modalComponent={<CreateExpense />}
                        />
                    </div>
                </div>

                <div className="grid-3fr height-5vh expense-summary" id="summary">
                    <div>Group name</div>

                </div>

                <div className="line-5vh">
                    {validgroup.length > 0 ?
                        (validgroup.map(group =>
                            <div key={group.id} className="detail">
                                <NavLink to={`/groups/${group.id}`} style={{ textDecoration: 'none', lineHeight: '5vh' }}>
                                    <div className="grid-3fr height-8vh expense-summary">{group.name}</div>
                                </NavLink>
                            </div>
                        ))
                        :
                        (<div></div>)
                    }

                </div>

            </div>
        </>

    );
}

export default GroupListByFriend;
