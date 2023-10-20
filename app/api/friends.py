from flask import Blueprint, jsonify, request
from flask_login import login_required,current_user
from app.models import db, User, Group
from ..forms import FriendForm


friends = Blueprint('friends', __name__)

#add a friend
@friends.route('/', methods=['POST'])
@login_required
def createFriend():
    form = FriendForm()
    form['csrf_token'].data = request.cookies['csrf_token']


    if form.validate_on_submit():
        '''check if the new friend exsits in db, if so, return friend info'''
        allfriends = User.query.all()
        allfriendsDict = [friend.to_dict() for friend in allfriends]
        for friend in allfriendsDict:
            if friend['email'] == form.data['email']:
                db.session.add(friend)
                db.session.commit()
                return friend
            else:
                '''if the new friend doesn't exsit in db, you can't add the friend to the list'''
                return "Your friend isn't registered. Please invite them to register with us."
    else:
        return jsonify(errors= form.errors), 400
