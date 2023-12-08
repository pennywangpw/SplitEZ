import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from "react";
import * as userthunk from "../../store/user";
import * as imagethunk from "../../store/image";
import avatar from "../../img/avatar.png"

function AccountSetting() {
    const dispatch = useDispatch()
    const currentuser = useSelector((state) => state.session.user);
    const avatarimg = useSelector((state) => state.images.singleImage);

    let posted_avatar_url =""
    if (Object.values(avatarimg).length > 0){
        console.log("avatarimg url: ", Object.values(avatarimg)[0]["image_url"])
        posted_avatar_url = Object.values(avatarimg)[0]["image_url"]
    }

    const [editnamebar, setEditnamebar] = useState("off")
    const [editemailbar, setEditemailbar] = useState("off")
    const [username, setUsername] = useState(currentuser.username)
    const [useremail, setUseremail] = useState(currentuser.email)
    const [imageurl, setImageurl] = useState(null)
    // const [avatarimg, setAvatarimg] = useState(avatar)
    const [imageLoading, setImageLoading] = useState(false);


    const divRef = useRef();
    const inputRef = useRef()

    useEffect(()=>{
         dispatch(imagethunk.singleImagethunk(currentuser.id))
    },[])

    useEffect(() => {

        const closeUserNameInput = (e) => {
            console.log("Account-closeUserNameInput檢查e是什麼?", e)
            console.log("useeffect中的username: ", username)
            if (divRef.current) {
                if (!divRef.current.contains(e.target)) {
                    // let payload = { 'name': username, 'email': useremail }

                    // dispatch(userthunk.updateFriendthunk(payload, currentuser.id))
                    setEditnamebar("off");
                }
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
            console.log("useeffect中的useremail: ", useremail)
            if (inputRef.current) {
                if (!inputRef.current.contains(e.target)) {
                    // let payload = { 'name': username, 'email': useremail }

                    // dispatch(userthunk.updateFriendthunk(payload, currentuser.id))
                    setEditemailbar("off");
                }
            }
        };

        document.addEventListener("click", closeUserEmailInput);
        return () => document.removeEventListener("click", closeUserEmailInput);

    }, [editemailbar, useremail])


    const editNamehandler = () => {
        setEditnamebar("on")
    }

    const editEmailhandler = () => {
        setEditemailbar("on")
    }

    const updateUserinfohandler = () => {
        let payload = { 'name': username, 'email': useremail }
        dispatch(userthunk.updateUserthunk(payload, currentuser.id))
    }

    // const postPicturehandler = () => {
    //     // window.alert("這裡是post picture handler..")
    //     let payload = { 'image_url': imageurl }
    //     console.log("傳出去的payload: ", payload)
    //     dispatch(imagethunk.addImagethunk(payload, currentuser.id))

    // }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData()
        formData.append("image", imageurl)

        setImageLoading(true)
        await dispatch(imagethunk.addImagethunk(formData))
    }



    return (
        <>
            <div className="height-50">
                <div>Your account</div>
                <div className="flx">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="flx-col">
                            {Object.keys(avatarimg).length === 0? <img src={avatar} alt="default_pic" />: <img src={posted_avatar_url} alt="avatar_pic" />}
                            {/* <img src={avatar} alt="default_pic" /> */}
                            <label>Change your avatar</label>
                            <div className="flx-col">
                                <input type="file" accept="image/*" onChange={(e) => setImageurl(e.target.files[0])} />
                                <button className="button-orange">Submit</button>
                            </div>

                        </div>
                        {/* <button className="button-orange" onClick={postPicturehandler}>Post your picture</button> */}

                    </form>
                    {/* <div className="width-50 flx-col">
                        <div>pic...</div>
                        <div>
                            <div>Change your avatar</div>
                            <button className="button-orange" onClick={postPicturehandler}>Post your picture</button>
                        </div>
                    </div> */}
                    <div className="flx-col width-50">
                        <div>
                            <ul>Your name:</ul>
                            <div className='flx font-weight' ref={divRef} >
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
                                    <button className="edit-btn" id="editname-btn" onClick={editNamehandler} >
                                        <i class="fas fa-edit"></i>
                                        Edit
                                    </button>
                                </ul>
                            </div>
                        </div>
                        <div>
                            <ul>Your email address:</ul>
                            <div className='flx font-weight' ref={inputRef}>
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

                                    <button className="edit-btn" onClick={editEmailhandler}>
                                        <i class="fas fa-edit"></i>
                                        Edit
                                    </button>
                                </ul>
                            </div>
                            <ul>
                                <button className="button-orange" onClick={updateUserinfohandler}>Save</button>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}


export default AccountSetting;
