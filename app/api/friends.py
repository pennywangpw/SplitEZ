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
