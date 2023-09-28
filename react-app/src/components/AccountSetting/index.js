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

    useEffect(() => {
        console.log("useEffect 有runs")
        // if (editnamebar) return;

        const closeMenu = (e) => {
            console.log("Account-closeMenu檢查e是什麼?", e)

            if (!divRef.current.contains(e.target)) {
                setEditnamebar("off");
            }
        };

        document.addEventListener("click", closeMenu);
        return () => document.removeEventListener("click", closeMenu);

    }, [editnamebar])

    const editNamehandler = () => {
        setEditnamebar("on")
        // dispatch(userthunk.updateFriendthunk(new_name, currentuser.id))
    }

    const editEmailhandler = () => {
        setEditemailbar("on")
        // dispatch(userthunk.updateFriendthunk(new_name, currentuser.id))
    }
    console.log("查閱username", username)

    console.log("查閱editbar", editnamebar)
    // console.log("這個是flyoutbtn", flyoutbtn)

    return (
        <>
            <div className="height-50">
                <div>Your account</div>
                <div className="flx">
                    <div className="width-50">picture</div>
                    <div className="flx-col width-50">
                        <div>
                            <ul>Your name</ul>
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
                            <ul>Your email address</ul>
                            <div className='flx'>
                                {editemailbar === "on" ? (<input
                                    id="username"
                                    type="text"
                                    value={useremail}
                                    onChange={(e) => {
                                        setUseremail(e.target.value)
                                    }
                                    }
                                />) : (<ul>{currentuser.email}</ul>)}
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
