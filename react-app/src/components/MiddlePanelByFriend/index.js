import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import OpenModalButton from "../OpenModalButton";
import CreateExpense from "../CreateExpense";
import * as usersthunk from "../../store/user";
import * as friendsthunk from "../../store/friend";




function GroupListByFriend() {
    let { friendId } = useParams()
    const dispatch = useDispatch()

    const allGroupsAndUsers = useSelector((state) => state.users.allUsersWithGroupInfo)
    const allGroupsAndUsersArr = Object.values(allGroupsAndUsers)
    const allGroups = useSelector((state) => state.groups.allGroups);
    const allGroupsArr = Object.values(allGroups)
    const singleFriend = useSelector((state) => state.friends.singleFriend)



    useEffect(() => {
        dispatch(friendsthunk.singleFriendthunk(friendId))
        return () => dispatch(friendsthunk.clearSingleFriendA())
    }, [friendId])


    //get all group's names
    let groupsname = []
    for (let group of allGroupsArr) {
        groupsname.push(group.name)
    }


    //choose the selected frined in allusers
    let selectedFriend = singleFriend


    return (
        <>
            <div className="shadow">

                <div className="flx line-h70 bg-maim-eee border-top-main border-bottom-main fontS-13px ">
                    {selectedFriend && selectedFriend.nickname !== null ? (<div className="fontS-220rem width-50">{selectedFriend.friend_name} ({selectedFriend.nickname})</div>) : (<div className="fontS-220rem width-50">{selectedFriend.friend_name} </div>)

                    }

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
                    {selectedFriend.groups ?

                        (selectedFriend.groups.map(group =>
                            <div key={group.id} className="detail">
                                <NavLink to={`/groups/${group.id}`} style={{ textDecoration: 'none', lineHeight: '5vh' }}>
                                    <div className="grid-3fr height-8vh expense-summary">{group.name}</div>
                                </NavLink>
                            </div>
                        ))
                        :
                        (<div> Not involes in any groups...</div>)

                    }

                </div>

            </div>
        </>

    );
}

export default GroupListByFriend;
