from flask import Blueprint, jsonify, request
from flask_login import login_required,current_user
from app.models import db, User, Friend
from ..forms import FriendForm


friends = Blueprint('friends', __name__)

#add a friend
@friends.route('/', methods=['POST'])
@login_required
def createFriend():
    form = FriendForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    print(f"這邊是form.data {form.data}")

    if form.validate_on_submit():
        allusers = User.query.all()
        allusersDict = [user.to_dict() for user in allusers]

        allfriends = Friend.query.all()
        allfriendsDict = [friend.to_dict() for friend in allfriends]
        currentuser = current_user.to_dict()

        for user in allusersDict:
            '''check if the new friend exists in db, if so, return new_friend info'''
            if user['email'] == form.data['email']:
                new_friend = user

                '''Check if the new friend has been added or not'''
                for friend in allfriendsDict:
                    '''check if new friend relationship has been set up or not'''
                    if friend['friend_id'] == new_friend['id'] and currentuser['id'] == friend['belongs_to_user_id']:
                        return "Your friend is already on the friend list :)"

                newfriend = Friend(
                    name= new_friend['username'],
                    friend_id= new_friend['id'],
                    belongs_to_user_id = currentuser['id']
                )

                db.session.add(newfriend)
                db.session.commit()

                return newfriend.to_dict()

        '''if the new friend doesn't exist in db, you can't add the friend to the list'''
        return "Your friend isn't registered. Please invite them to register with us."
    else:
        return jsonify(errors= form.errors), 400


#get all friends
@friends.route('/myfriends')
@login_required
def allfriends():
    '''get all friend friends from db'''
    friends = Friend.query.all()
    friendsDict = [friend.to_dict() for friend in friends]

    friends_belong_to_me = []
    currentuser = current_user.to_dict()

    '''find friends belong to the user'''
    for friend in friendsDict:
        if friend['belongs_to_user_id'] == currentuser['id']:
            friends_belong_to_me.append(friend)

    return friends_belong_to_me




#delete a friend
@friends.route('/<int:id>', methods=['DELETE'])
@login_required
def deleteFriend(id):
    '''get all friend friends belong to current user from db'''
    currentuser = current_user.to_dict()
    friends = Friend.query.filter_by(belongs_to_user_id = currentuser['id']).all()


    '''find the friend whom the user wants to delete from friends_belong_to_me'''
    friendsDict = [friend.to_dict() for friend in friends]
    for friend in friendsDict:
        if friend['friend_id'] == id:

            '''find the deleted_friend from db by friend id'''
            deleted_friend = Friend.query.get(friend['id'])

            deleted_friendDict = deleted_friend.to_dict()

            db.session.delete(deleted_friend)
            db.session.commit()
            return deleted_friendDict

    return "No friends on the list"


#update friend's name, but only add a nickname
@friends.route('/<int:id>', methods=['PUT'])
@login_required
def updateFriendNickname(id):
    form = FriendForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    print(f"這裡是update {form.data}")

    '''get all friend friends belong to current user from db'''
    currentuser = current_user.to_dict()
    friends = Friend.query.filter_by(belongs_to_user_id = currentuser['id']).all()

    '''find the friend whom the user wants to update'''
    friendsDict = [friend.to_dict() for friend in friends]
    for friend in friendsDict:
        if friend['friend_id'] == id:
            '''find the updated_friend from db by friend id'''
            updated_friend = Friend.query.get(friend['id'])
            print(f"找到updated firend {updated_friend}")

            updated_friend.nickname = form.data['nickname']
            db.session.commit()
            updatedfriendDict = updated_friend.to_dict()

            return updatedfriendDict

    return "test"

    # form = UserForm()
    # form['csrf_token'].data = request.cookies['csrf_token']

    # if form.validate_on_submit():
    #     '''query db to get the user which the user wants to update'''
    #     updatedfriend = User.query.get(id)

    #     updatedfriend.username = updatedfriend.username + form.data['name']

    #     updatedfriend.email = form.data['email']

    #     db.session.commit()
    #     updatedfriendDict = updatedfriend.to_dict()

    #     print(f'這裡是後端的updatedfriend. group{updatedfriend.groups}')
    #     updatedfriendDict['involved_group'] = updatedfriend.groups
    #     updatedfriendDict['user_id'] = updatedfriend.id
    #     print(f'加上去後-這裡是後端的updatedfriend. group{updatedfriendDict}')


    #     return updatedfriendDict
    # return "not passed validation"
