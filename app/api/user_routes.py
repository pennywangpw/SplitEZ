from flask import Blueprint, jsonify, request
from flask_login import login_required,current_user
from app.models import db, User
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
    '''get all users (usersDict)'''
    users = User.query.all()
    usersDict = [user.to_dict() for user in users]
    print(f"測試看看{usersDict}")


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
            userinfo['groupid'] = usersWithGroup[idx]
            idx+=1

    print(f"123有沒有家成功{usersDict}")

    return usersDict

#update friend's name, but only add a description
@user_routes.route('/<int:id>', methods=['PUT'])
@login_required
def updateFriendName(id):
    form = UserForm()
    print("form 長什麼樣子: ", form, id)
    form['csrf_token'].data = request.cookies['csrf_token']
    updatedfriend = User.query.get(id)
    print("updatedfriend: ",updatedfriend)
    if form.validate_on_submit():
        updatedfriend.username = form.data['name']
        db.session.commit()
        updatedfriendDict = updatedfriend.to_dict()
        print("updatedfriendDict: ",updatedfriendDict)
        return updatedfriendDict
    return "Bad Data-update a friend's name"


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
