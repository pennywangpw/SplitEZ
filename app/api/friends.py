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

    if form.validate_on_submit():
        '''check if the new friend exists in db, if so, return friend info'''
        allusers = User.query.all()
        allusersDict = [user.to_dict() for user in allusers]
        allfriends = Friend.query.all()
        allfriendsDict = [friend.to_dict() for friend in allfriends]
        currentuser = current_user.to_dict()

        for user in allusersDict:
            if user['email'] == form.data['email']:

                '''Check if the new friend doesn't exist in the friend list to avoid duplicates.'''
                for friend in allfriendsDict:
                    if user['id'] == friend['friend_id']:
                        return "Your friend is already on the friend list :)"

                newfriend = Friend(
                    name= user['username'],
                    friend_id= user['id']
                )
                db.session.add(newfriend)
                db.session.commit()
                return newfriend.to_dict()

        '''if the new friend doesn't exist in db, you can't add the friend to the list'''
        return "Your friend isn't registered. Please invite them to register with us."
    else:
        return jsonify(errors= form.errors), 400
