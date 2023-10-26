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

    '''check if pass the validation'''
    if not form.validate_on_submit():
        return jsonify(errors= form.errors), 400

    '''check if the new friend is existing user'''
    existing_user = User.query.filter_by(email= form.data['email']).first()
    if not existing_user:

        return "Your friend isn't registered. Please invite her/him to register with us."


    existing_friend = Friend.query.filter_by(friend_id = existing_user.id, belongs_to_user_id = current_user.id).first()
    if existing_friend:
        return "Your friend is already on the friend list :)"

    if existing_user.id == current_user.id:
        return "You can't add yourself"

    new_friend = Friend(
    friend_id= existing_user.id,
    belongs_to_user_id = current_user.id
    )

    db.session.add(new_friend)
    db.session.commit()

    '''add username information to new friend on backend res'''
    new_friendDict = new_friend.to_dict()
    new_friendDict['friend_name'] = existing_user.username
    return new_friendDict




#get all friends
@friends.route('/myfriends')
@login_required
def allfriends():
    '''get all friends whose belongs_to_user_id is current user'''
    friends_belong_to_me = Friend.query.filter_by(belongs_to_user_id = current_user.id).all()

    friends_info = [friend.user for friend in friends_belong_to_me]

    '''add username information to each friend on backend res'''
    all_friends =[]
    for i in range(len(friends_belong_to_me)):

        friendDict = friends_belong_to_me[i].to_dict()
        friendDict['friend_name'] = friends_info[i].username
        all_friends.append(friendDict)


    return all_friends




#delete a friend
@friends.route('/<int:id>', methods=['DELETE'])
@login_required
def deleteFriend(id):
    '''find the friend whom the current user wants to delete'''
    deleted_friend = Friend.query.filter_by(belongs_to_user_id = current_user.id , friend_id= id).first()

    if deleted_friend:
            '''add username information to deleted friend on backend res'''
            deleted_friend_info = deleted_friend.user

            deleted_friendDict = deleted_friend.to_dict()
            deleted_friendDict['friend_name'] = deleted_friend_info.username

            db.session.delete(deleted_friend)
            db.session.commit()

            return deleted_friendDict

    return "Can't find the friend to delete"


#update friend's name, but only add a nickname
@friends.route('/<int:id>', methods=['PUT'])
@login_required
def updateFriendNickname(id):
    form = FriendForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    '''find the friend whom the current user wants to update'''
    updated_friend = Friend.query.filter_by(belongs_to_user_id = current_user.id , friend_id= id).first()

    '''if the updated_friend is on user's friend list, update it and save it to db'''
    if updated_friend:
        updated_friend.nickname = form.data['nickname']
        db.session.commit()

        '''add username information to updated friend on backend res'''
        updated_friend_info = updated_friend.user
        updated_friendDict = updated_friend.to_dict()
        updated_friendDict['friend_name'] = updated_friend_info.username

        return updated_friendDict

    return "can't find the friend"
