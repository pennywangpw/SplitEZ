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
    print(f"get all friends-usersWithGroups {usersWithGroups}")

    '''add involved_group and user_id for each user in userDict'''
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


    '''iterate all users(usersDict) to check if user's involved_group id in mygroupsid'''
    '''if so, add it to friends []'''
    for user in usersDict:
        for involved_group in user['involved_group']:
            if involved_group['id'] in mygroupsid:
                friends.append(user)
                break
    return friends





#update user's name, username and email can be changed
@user_routes.route('/<int:id>', methods=['PUT'])
@login_required
def updateFriendName(id):
    form = UserForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    updated_user = User.query.get(id)

    if form.validate_on_submit():
        updated_user.username = form.data['name']
        updated_user.email = form.data['email']

        db.session.commit()
        updatedfriendDict = updated_user.to_dict()

        return updatedfriendDict
    return "Bad Data-update a friend's name"









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
