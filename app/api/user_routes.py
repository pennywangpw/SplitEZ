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

    '''create usersWithGroup to collect each user with group infomation'''
    '''iterate through users, create user_groups [] for each user AND iterate through user.groups column '''
    '''then append each group to user_group'''
    '''get all groups (usersWithGroup) for each of user'''
    usersWithGroup2 = []
    for user in users:
        user_groups = []
        for group in user.groups:
            user_groups.append(group.to_dict())
        usersWithGroup2.append(user_groups)

    print(f"正在測試usersWithGroup2{usersWithGroup2}")

    '''add groupinfo in userDict'''
    idx=0
    for userinfo in usersDict:
            print(f"userinfo: {userinfo}")
            userinfo['involved_group'] = usersWithGroup2[idx]
            userinfo['user_id'] = userinfo['id']
            idx+=1
    print(f"看下最終長什麼{usersDict}")

    '''select my friend who is involed in the groups I have'''
    friends=[]

    allgroups = Group.query.all()
    allgroupsDict = [group.to_dict() for group in allgroups]
    mygroups =[]
    for group in allgroupsDict:
        mygroups.append(group['id'])

    print(f"所有的group{allgroupsDict}")
    print(f"所有的mygroups{mygroups}")

    for user in usersDict:
        print(f"每一個user{user}")
        if user['id'] in mygroups:
            friends.append(user)
    return friends


#update friend's name, but only add a description
@user_routes.route('/<int:id>', methods=['PUT'])
@login_required
def updateFriendName(id):
    form = UserForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        '''query db to get the user which the user wants to update'''
        updatedfriend = User.query.get(id)
        print("updatedfriend: ",updatedfriend)

        updatedfriend.username = form.data['name']
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


#create a friend
@user_routes.route('', methods=['POST'])
@login_required
def createFriend():
    form = UserForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        '''create a new user(friend) and store in db'''
        print("確認一下form: ", form.data)
        new_friend = User(
            username= form.data['name'],
            email = form.data['email']
        )
        print("新朋友: ", new_friend)
        print("新朋友: ", new_friend.to_dict())


        db.session.add(new_friend)
        db.session.commit()
        return "123"
    return "Bad Data"


#Add a friend
@user_routes.route('/add-a-friend', methods=['POST'])
@login_required
def addFriend():
    form = UserForm.from_json(request.json)
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        '''query all users from db'''
        updatedfriend = User.query.all()
        print(f"updatedfriend: {updatedfriend}")
        updatedfriendDict = [friend.to_dict() for friend in updatedfriend]
        print(f"updatedfriendDict: {updatedfriendDict}")
        for friend in updatedfriendDict:
            if friend['email'] == form.data['email']:
                return friend
        return "The friend doesn't exisit"
    return "invalid email address"



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
