import { useDispatch, useSelector } from 'react-redux';
import { useState } from "react";
import * as userthunk from "../../store/user";


function AccountSetting() {
    const dispatch = useDispatch()
    const currentuser = useSelector((state) => state.session.user);
    const [editbar, setEditbar] = useState("off")
    const [username, setUsername] = useState(currentuser.username)

    const editNamehandler = (new_name) => {
        console.log("修改profile的new_name:", new_name)
        setEditbar("on")
        // dispatch(userthunk.updateFriendthunk(new_name, currentuser.id))
    }
    console.log("查閱editbar", editbar)

    return (
        <>
            <div className="height-50">
                <div>Your account</div>
                <div className="flx">
                    <div className="width-50">picture</div>
                    <div className="flx-col width-50">
                        <div>
                            <ul>Your name</ul>
                            <div className='flx'>
                                {/* <input
                                    id="username"
                                    type="text"
                                    value={currentuser.username}
                                    onChange={(e) => editNamehandler(e.target.value)}
                                /> */}
                                {/* <ul>{currentuser.username}</ul> */}
                                {editbar === "on" ? (<input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => editNamehandler(e.target.value)}
                                />) : (<ul>{currentuser.username}</ul>)}

                                <ul>
                                    <button className='button-decision' onClick={editNamehandler}>Edit</button>
                                </ul>
                            </div>
                        </div>
                        <div>
                            <ul>Your email address</ul>
                            <div className='flx'>
                                <ul>{currentuser.email}</ul>
                                <ul>
                                    <button className='button-decision'>Edit</button>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="height-50">
                <div>Advanced feature</div>
                <div className="flx">
                    <button>Delete your account</button>
                </div>

            </div>
        </>
    )
}


export default AccountSetting;
