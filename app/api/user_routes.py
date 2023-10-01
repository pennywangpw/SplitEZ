from flask import Blueprint, jsonify, request
from flask_login import login_required,current_user
from app.models import db, User, Group
from ..forms import UserForm


user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}

#get a specific friend by friend's id
@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()


#get all users with group info, return in arr with user and group info
@user_routes.route('/all')
@login_required
def userswithGroupinfo():
    '''get all users and change to dictionary(usersDict) and store in a list'''
    users = User.query.all()
    usersDict = [user.to_dict() for user in users]
    print(f"測試看看{usersDict}")

    '''create usersWithGroup to collect each user with group infomation'''
    '''iterate through users, create user_groups [] for each user AND iterate through user.groups column '''
    '''then append each group to user_group'''
    '''get all groups (usersWithGroup) for each of user'''
    usersWithGroup = []
    for user in users:
        user_groups = []
        for group in user.groups:
            user_groups.append(group.to_dict())
        usersWithGroup.append(user_groups)


    '''add groupinfo in userDict'''
    idx=0
    for userinfo in usersDict:
            print(f"userinfo: {userinfo}")
            userinfo['involved_group'] = usersWithGroup[idx]
            userinfo['user_id'] = userinfo['id']
            idx+=1

    print(f"123有沒有家成功{usersDict}")

    return usersDict

#get all friends with group info, return in arr with user and group info
@user_routes.route('/myfriends')
@login_required
def friendwithGroupinfo():
    '''get all users and change to dictionary(usersDict) and store in a list'''
    users = User.query.all()
    usersDict = [user.to_dict() for user in users]

    '''create usersWithGroups to collect each user with group infomation'''
    '''iterate through users, create user_groups [] for each user AND iterate through user.groups column '''
    '''then append each group to user_group'''
    '''get all groups (usersWithGroup) for each of user'''
    usersWithGroups = []
    for user in users:
        user_groups = []
        for group in user.groups:
            user_groups.append(group.to_dict())
        usersWithGroups.append(user_groups)

    print(f"正在測試usersWithGroups{usersWithGroups}")

    '''add groupinfo in userDict'''
    idx=0
    for userinfo in usersDict:
            print(f"userinfo: {userinfo}")
            userinfo['involved_group'] = usersWithGroups[idx]
            userinfo['user_id'] = userinfo['id']
            idx+=1
    print(f"看下最終長什麼{usersDict}")

    '''select my friend who is involed in the groups I have'''
    friends=[]

    '''query all groups to find all group id'''
    allgroups = Group.query.all()
    print(f"後端確認現在Group {allgroups}")
    allgroupsDict = [group.to_dict() for group in allgroups]
    mygroupsid =[]
    for group in allgroupsDict:
        mygroupsid.append(group['id'])

    print(f"所有的group{allgroupsDict}")
    print(f"所有的mygroupsid{mygroupsid}")

    '''iterate all users to check if user's involved_group id in mygroupsid'''
    for user in usersDict:
        print(f"每一個user{user}")
        for involved_group in user['involved_group']:
            if involved_group['id'] in mygroupsid:
                friends.append(user)
                break
    print(f"最終返回的friends{friends}")
    return friends


#update friend's name, but only add a description
@user_routes.route('/<int:id>', methods=['PUT'])
@login_required
def updateFriendName(id):
    form = UserForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    print(f"檢查update friend {form.data}")
    if form.validate_on_submit():
        '''query db to get the user which the user wants to update'''
        updatedfriend = User.query.get(id)
        print("updatedfriend: ",updatedfriend)

        updatedfriend.username = updatedfriend.username + form.data['name']
        print(f"是否有修改名字成功{updatedfriend}")
        updatedfriend.email = form.data['email']
        db.session.commit()
        updatedfriendDict = updatedfriend.to_dict()
        print("updatedfriendDict: ",updatedfriendDict)
        return updatedfriendDict


# #update friend's name, but only add a description
# @user_routes.route('/<int:id>', methods=['PUT'])
# @login_required
# def updateFriendName(id):
#     form = UserForm()
#     print("form 長什麼樣子: ", form, id)
#     form['csrf_token'].data = request.cookies['csrf_token']
#     updatedfriend = User.query.get(id)
#     print("updatedfriend: ",updatedfriend)
#     if form.validate_on_submit():
#         updatedfriend.username = form.data['name']
#         db.session.commit()
#         updatedfriendDict = updatedfriend.to_dict()
#         print("updatedfriendDict: ",updatedfriendDict)
#         return updatedfriendDict
#     return "Bad Data-update a friend's name"


#add a friend
@user_routes.route('', methods=['POST'])
@login_required
def createFriend():
    form = UserForm()
    form['csrf_token'].data = request.cookies['csrf_token']


    if form.validate_on_submit():
        '''check if the new friend exsits in db, if so, return friend info'''
        allfriends = User.query.all()
        allfriendsDict = [friend.to_dict() for friend in allfriends]
        for friend in allfriendsDict:
            if friend['email'] == form.data['email']:
                return friend

        '''if the new friend doesn't exsit in db, create a new user(friend) and store in db'''
        new_friend = User(
            username= form.data['name'],
            email = form.data['email'],
            hashed_password = "null"
        )

        db.session.add(new_friend)
        db.session.commit()
        new_friendDict = new_friend.to_dict()
        return new_friendDict
    else:
        return jsonify(errors= form.errors), 400


#delete a friend
@user_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def deleteFriend(id):
    '''query the friend which the user wants to delete from db'''
    deleted_friend = User.query.get(id)
    print("找出要deleted_friend ", deleted_friend)

    if deleted_friend is not None:

        print("找出要deleted_friend ", deleted_friend.to_dict())
        print("找出要deleted_friend groups ", deleted_friend.groups)
        return "123"


    return "The friend does not exisit"



# #Add a friend-test
# @user_routes.route('/add-a-friend', methods=['POST'])
# @login_required
# def addFriend():
#     form = UserForm.from_json(request.json)
#     form['csrf_token'].data = request.cookies['csrf_token']

#     if form.validate_on_submit():
#         '''query all users from db'''
#         updatedfriend = User.query.all()
#         print(f"updatedfriend: {updatedfriend}")
#         updatedfriendDict = [friend.to_dict() for friend in updatedfriend]
#         print(f"updatedfriendDict: {updatedfriendDict}")
#         print(f"這裡是form.data {form.data}")
#         '''check if added friend is in the db'''
#         for friend in updatedfriendDict:
#             print(f"這裡是friend['email'] {friend['email']}")
#             print(f"這裡是form.data['email'] {form.data['email']}")
#             if friend['email'] == form.data['email']:
#                 return friend
#         return "The friend doesn't exisit"
#     return form.errors



# #get all users(frineds) belong to currentuser's group
# @user_routes.route('/all')
# @login_required
# def getAllusers():
#     """
#     Query for a user by
#     """

#     allgroupid = request.args.getlist('allgroupid')
#     print(f'HERE IS GET ALL USERS BELONG TO CURRENT USER GROUP {allgroupid }')
#     return "123"
#     # user = User.query.get()
#     # return user.to_dict()
