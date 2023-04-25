from flask import Blueprint, jsonify
from flask_login import login_required,current_user
from app.models import User

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


#get all groups
@user_routes.route('/all')
@login_required
def allGroups():
    print("----123")
    '''get all groups belong to current user'''
    id = current_user.id
    user = User.query.get(id)
    groups = user.groups
    print("get all groups: ", groups)
    a = [group.to_dict() for group in groups]
    print("**************************", a)
    return a
