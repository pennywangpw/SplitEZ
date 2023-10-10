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
            userinfo['involved_group'] = usersWithGroup[idx]
            userinfo['user_id'] = userinfo['id']
            idx+=1

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

    '''add groupinfo in userDict'''
    idx=0
    for userinfo in usersDict:
            userinfo['involved_group'] = usersWithGroups[idx]
            userinfo['user_id'] = userinfo['id']
            idx+=1


    '''select my friend who is involed in the groups I have'''
    friends=[]

    '''query all groups to find all group id'''
    allgroups = Group.query.all()

    allgroupsDict = [group.to_dict() for group in allgroups]
    mygroupsid =[]
    for group in allgroupsDict:
        mygroupsid.append(group['id'])


    '''iterate all users to check if user's involved_group id in mygroupsid'''
    for user in usersDict:
        for involved_group in user['involved_group']:
            if involved_group['id'] in mygroupsid:
                friends.append(user)
                break
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

        updatedfriend.username = updatedfriend.username + form.data['name']

        updatedfriend.email = form.data['email']

        db.session.commit()
        updatedfriendDict = updatedfriend.to_dict()

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

        new_friendDict = new_friend.to_dict()
        new_friendDict['involved_group'] = []

        db.session.add(new_friend)
        db.session.commit()
        return new_friendDict
    else:
        return jsonify(errors= form.errors), 400


#delete a friend
@user_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def deleteFriend(id):
    '''query the friend which the user wants to delete from db'''
    deleted_friend = User.query.get(id)

    if deleted_friend is not None:
        deleted_friendDict =  deleted_friend.to_dict()

        '''add involved_group attribute and insert associated groups if any'''
        deleted_friendDict['involved_group'] =[]
        for group in deleted_friend.groups:
            deleted_friendDict['involved_group'].append(group.to_dict())

        '''add user_id attribute'''
        deleted_friendDict['user_id'] = deleted_friendDict['id']

        db.session.delete(deleted_friend)
        db.session.commit()
        return deleted_friendDict

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
