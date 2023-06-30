import React from "react";
import { NavLink } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import OpenModalButton from "../OpenModalButton";
import CreateExpense from "../CreateExpense"



function GroupListByFriend() {
    let { friendId } = useParams()
    const allusersDetails = useSelector((state) => state.users.friendsWithGroupInfo)

    //choose the selected frined in allusers
    let selectedFriend = allusersDetails[friendId]

    return (
        <>
            <div className="shadow">
                <div className="flx line-h70 bg-maim-eee border-top-main border-bottom-main fontS-13px ">
                    <div className="fontS-220rem width-50">{selectedFriend.username}</div>
                    <div className="btn-create">
                        <OpenModalButton
                            className={"button"}
                            buttonText="Add an expense"
                            modalComponent={<CreateExpense />}
                        />
                    </div>
                </div>

                <div className="grid-3fr height-5vh expense-summary" id="summary">
                    <div>Group name</div>

                </div>

                <div className="line-5vh">
                    {selectedFriend.groupid.map(group =>
                        <>
                            <div key={group.id}>
                                <NavLink to={`/groups/${group.id}`} style={{ textDecoration: 'none', lineHeight: '5vh' }}>
                                    <div className="grid-3fr height-8vh expense-summary">{group.name}</div>
                                </NavLink>
                            </div>
                        </>
                    )}

                    {/* <NavLink to={`/groups/${group.id}`}>
                        {selectedFriend.groupid.map(group => <div>{group.name}</div>)}
                    </NavLink> */}
                </div>




            </div>
        </>

    );
}

export default GroupListByFriend;
