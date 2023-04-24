from flask import Blueprint, jsonify, request
from app.models import db, Group, User
from flask_login import current_user, login_required
from ..forms import ExpenseForm

groups = Blueprint('groups', __name__)



#get all groups
@groups.route('/all')
@login_required
def allGroups():
    id = current_user.id
    user = User.query.filter(User.id == id).one()
    user_data = user.to_dict()
    print("get the user first: ",user , user_data)

    return "listsList"
