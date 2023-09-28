import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from "react";
import * as userthunk from "../../store/user";


function AccountSetting() {
    const dispatch = useDispatch()
    const currentuser = useSelector((state) => state.session.user);
    const [editnamebar, setEditnamebar] = useState("off")
    const [editemailbar, setEditemailbar] = useState("off")
    const [username, setUsername] = useState(currentuser.username)
    const [useremail, setUseremail] = useState(currentuser.email)
    const divRef = useRef();
    const inputRef = useRef()

    useEffect(() => {

        const closeUserNameInput = (e) => {
            console.log("Account-closeUserNameInput檢查e是什麼?", e)
            console.log("useeffect中的username: ", username)
            if (!divRef.current.contains(e.target)) {
                let payload = { 'name': username, 'email': useremail }

                dispatch(userthunk.updateFriendthunk(payload, currentuser.id))
                setEditnamebar("off");
            }
        };
        document.addEventListener("click", closeUserNameInput);
        console.log("username: ", username)
        // dispatch(userthunk.updateFriendthunk(username, currentuser.id))
        return () => document.removeEventListener("click", closeUserNameInput);

    }, [editnamebar, username])


    useEffect(() => {

        const closeUserEmailInput = (e) => {
            console.log("Account-closeUserEmailInput檢查e是什麼?", e)

            if (!inputRef.current.contains(e.target)) {
                setEditemailbar("off");
            }
        };

        document.addEventListener("click", closeUserEmailInput);
        return () => document.removeEventListener("click", closeUserEmailInput);

    }, [editemailbar])


    const editNamehandler = () => {
        setEditnamebar("on")
        // dispatch(userthunk.updateFriendthunk(new_name, currentuser.id))
    }

    const editEmailhandler = () => {
        setEditemailbar("on")
        // dispatch(userthunk.updateFriendthunk(new_name, currentuser.id))
    }
    console.log("查閱username", username)

    console.log("查閱editnamebar", editnamebar)
    console.log("查閱editemailbar", editemailbar)


    return (
        <>
            <div className="height-50">
                <div>Your account</div>
                <div className="flx">
                    <div className="width-50">picture</div>
                    <div className="flx-col width-50">
                        <div>
                            <ul>Your name:</ul>
                            <div className='flx' ref={divRef} >
                                {editnamebar === "on" ? (<input
                                    id="user_name"
                                    type="text"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value)
                                    }
                                    }
                                />) : (<ul>{username}</ul>)}

                                <ul>
                                    <button className='button-decision' id="editname-btn" onClick={editNamehandler} >Edit</button>
                                </ul>
                            </div>
                        </div>
                        <div>
                            <ul>Your email address:</ul>
                            <div className='flx' ref={inputRef}>
                                {editemailbar === "on" ? (<input
                                    id="user_email"
                                    type="text"
                                    value={useremail}
                                    onChange={(e) => {
                                        setUseremail(e.target.value)
                                    }
                                    }
                                />) : (<ul>{useremail}</ul>)}
                                <ul>
                                    <button className='button-decision' onClick={editEmailhandler}>Edit</button>
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
