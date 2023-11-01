import React, { useEffect } from "react";
import { useModal } from "../../context/Modal";
import { useSelector, useDispatch } from 'react-redux';
import * as usersthunk from "../../store/user";
import * as friendsthunk from "../../store/friend";
import * as groupsthunk from "../../store/group";
import { useState } from "react";



// function FriendModal({ name, id, type }) {
//     const dispatch = useDispatch()
//     const { closeModal } = useModal()
//     // const [friendname, setFriendName] = useState(name)
//     const [friendemail, setFriendemail] = useState()

//     const [errors, setErrors] = useState([])

//     // validation for group name
//     useEffect(() => {
//         let e = []
//         // if (friendname === undefined) e.push("Please provide friend's name")
//         // if (friendname.length === 0) e.push("Please provide friend's name")
//         // if (friendname !== undefined && friendname.length > 10) e.push("Please shorten the friend's name")
//         if (friendemail === undefined) e.push("Please provide friend's email")

//         setErrors(e)
//     }, [friendemail])


//     const handleSubmit = (e) => {
//         e.preventDefault()
//         let payload = { 'name': 'null', 'email': friendemail }
//         console.log("按下load:去的pay ", payload)
//         if (type === "add friend") {
//             dispatch(usersthunk.addFriendthunk(payload)).then(closeModal)
//         }
//         else if (type === "edit friend") {
//             dispatch(usersthunk.updateFriendthunk(payload, id)).then(dispatch(usersthunk.allUsersWithGroupInfo())).then(closeModal())
//             // dispatch(usersthunk.updateFriendthunk(payload, id)).then(dispatch(groupsthunk.allGroupsthunk())).then(closeModal())
//         }

//     }



//     return (
//         <>
//             <form onSubmit={handleSubmit} className="modal-group">
//                 <div className="width-350px height-350px">
//                     {type === "add friend" ? (<header className="bg-5cc5a7">Add a friend</header>) :
//                         (<header className="bg-5cc5a7">Add a friend</header>)}
//                     <div>
//                         <div id="error">
//                             {errors.length > 0 ? (errors.map(error => <div>{error}</div>)) : <div></div>}
//                             {/* {errors.length > 0 && errors.map(error => <div>{error}</div>)} */}
//                         </div>
//                         {type === "add friend" ? (
//                             <label htmlFor="friendname">
//                                 Your friend's email...
//                             </label>
//                         ) :
//                             (
//                                 <label htmlFor="friendname">
//                                     You may change friend's name
//                                 </label>
//                             )}

//                         <input
//                             id="friendname"
//                             type="text"
//                             value={friendemail}
//                             onChange={(e) => setFriendemail(e.target.value)}
//                         />
//                         {type === "edit friend" ? (
//                             <div>
//                                 <label htmlFor="friendname">
//                                     Friend's email...
//                                 </label>
//                                 <input
//                                     id="friendname"
//                                     type="text"
//                                     value={friendemail}
//                                     onChange={(e) => setFriendemail(e.target.value)}
//                                 />
//                             </div>
//                         ) :
//                             (
//                                 <div></div>
//                             )}

//                     </div>
//                     <button className="button-decision" type="submit" disabled={errors.length > 0}>Yes</button>
//                     <button className="button-decision" onClick={closeModal}>No</button>
//                 </div>
//             </form>
//         </>
//     )
// }
function FriendModal({ name, id, email, type }) {
    const dispatch = useDispatch()
    const { closeModal } = useModal()
    const [friendname, setFriendName] = useState(name)
    const [friendemail, setFriendemail] = useState(email)
    const [nickname, setNickname] = useState(null)
    const [errors, setErrors] = useState([])
    const current_user = useSelector((state) => state.session.user)

    // validation for group name
    useEffect(() => {

        let e = []
        if (friendname === undefined) e.push("Please provide friend's name")
        if (friendname.length === 0) e.push("Please provide friend's name")
        if (friendname !== undefined && friendname.length > 10) e.push("Please shorten the friend's name")
        if (friendemail === undefined) e.push("Please provide friend's email")
        if (friendemail === current_user.email) e.push("You can't add yourself")
        if (friendemail === 'Invalid email address.') e.push("Invalid email address")
        if (friendemail === "Your friend isn't registered. Please invite her/him to register with us.") e.push("Your friend isn't registered. Please invite her/him to register with us.")
        if (friendemail === "Your friend is already on the friend list :)") e.push("Your friend is already on the friend list :)")

        // if (typeof friendemail === "string") e.push(friendemail)


        setErrors(e)

    }, [friendname, friendemail])




    const handleSubmit = async (e) => {
        e.preventDefault()
        let payload = { 'name': friendname, 'email': friendemail, 'belongs_to_user_id': current_user.id, 'nickname': null }
        if (type === "add friend") {
            try {
                await dispatch(friendsthunk.addFriendthunk(payload))

                closeModal()
            } catch (error) {

                if (error.email) {
                    let errormessage = error.email[0]
                    await setFriendemail(errormessage)
                } else {
                    await setFriendemail(error)

                }


            }
            // await dispatch(usersthunk.allUsersWithGroupInfo())

        }
        else if (type === "edit friend") {
            let payload = { 'name': friendname, 'email': email, 'nickname': nickname }
            console.log("修改名字的payload:", payload)
            dispatch(friendsthunk.updateFriendthunk(payload, id)).then(() => dispatch(friendsthunk.allFriendsthunk())).then(closeModal())
            // dispatch(usersthunk.updateFriendthunk(payload, id)).then(dispatch(groupsthunk.allGroupsthunk())).then(closeModal())
        }


    }



    return (
        <>
            <form onSubmit={handleSubmit} className="modal-group">
                <div className="width-350px height-350px">
                    {type === "add friend" ? (<header className="bg-5cc5a7">Add a friend</header>) :
                        (<header className="bg-5cc5a7">Change friend's name</header>)}
                    <div>
                        <div id="error">
                            {errors.length > 0 ? (errors.map(error => <div>{error}</div>)) : <div></div>}
                            {/* {errors.length > 0 && errors.map(error => <div>{error}</div>)} */}
                        </div>
                        {
                            type === "add friend" ? (
                                <div>
                                    <label htmlFor="friendname">
                                        Friend's email...
                                    </label>
                                    <input
                                        id="friendname"
                                        type="text"
                                        placeholder={friendemail}
                                        onChange={(e) => setFriendemail(e.target.value)}
                                    />
                                </div>
                            )
                                :
                                (
                                    <div>
                                        <label htmlFor="friendname">
                                            You may add nickname for your friend...
                                        </label>
                                        <input
                                            id="friendname"
                                            type="text"
                                            onChange={(e) => setNickname(e.target.value)}
                                        />
                                    </div>
                                )}

                        {/* <input
                            id="friendname"
                            type="text"
                            value={friendname}
                            onChange={(e) => setFriendName(e.target.value)}
                        /> */}
                        {/* {type === "add friend" ? (
                            <div>
                                <label htmlFor="friendname">
                                    Friend's email...
                                </label>
                                <input
                                    id="friendname"
                                    type="text"
                                    placeholder={friendemail}
                                    onChange={(e) => setFriendemail(e.target.value)}
                                />
                            </div>
                        ) :
                            (
                                <div></div>
                            )} */}

                    </div>
                    <button className="button-decision" type="submit" disabled={errors.length > 0}>Yes</button>
                    <button className="button-decision" onClick={closeModal}>No</button>
                </div>
            </form>
        </>
    )
}

export default FriendModal;
