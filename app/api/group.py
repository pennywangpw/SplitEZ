from flask import Blueprint, jsonify, request
from app.models import db, Group, User, users_groups
from flask_login import current_user, login_required
from ..forms import GroupForm

groups = Blueprint('groups', __name__)



#get all groups
@groups.route('/all')
@login_required
def allGroups():
    print("----456")
    '''get all groups belong to current user'''
    id = current_user.id
    user = User.query.get(id)
    groups = user.groups
    print("get all groups: ", groups)
    groupsList = [group.to_dict() for group in groups]
    print("**************************", groupsList)
    return groupsList

    # print("----123")
    # '''get all groups belong to current user'''
    # id = current_user.id
    # user = User.query.get(id)
    # groups = user.groups
    # print("")


    # allgroups = Group.query.join(users_groups).join(User).filter(
    #     users_groups.user_id == current_user.id).all()

    # print("+++++++++++++++++++++++++++++123")
    # print("all groups belong to current user: ", allgroups)
    # groupsList= [group.to_dict() for group in allgroups]
    # print("all groups belong to current user/////: ", groupsList)

    # user = User.query.filter(User.id == id).one()
    # user_data = user.to_dict()
    # print("get the user first: ",user , user_data)

    return "111"

#get a group with all expenses under the group
@groups.route('/<int:id>')
@login_required
def singleGroup(groupId):
    group = Group.query.get(groupId)
    print(f'single group {group}')
    groupDict = group.to_dict()
    groupDict['expenses'] = []
    for group in group.expenses:
        groupDict['expenses'].append(group.to_dict())
    return groupDict

#create a group
@groups.route('', methods=['POST'])
@login_required
def createGroup():
    form = GroupForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        new_group = Group(
            name= form.data['name']
        )
        db.session.add(new_group)
        db.session.commit()
        print(f'this is create new_group {new_group}')
        return new_group.to_dict()
    return "Bad Data"


#rename a group
@groups.route('/<int:id>', methods=['PUT'])
@login_required
def updateGroup(id):
    form = GroupForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    updatedgroup = Group.query.get(id)

    if form.validate_on_submit():
        updatedgroup.name = form.data['name']
        db.session.commit()
        updatedgroupDict =  updatedgroup.to_dict()
        return updatedgroupDict
    return "Bad Data-update a group"


#delete a group
@groups.route('/<int:id>', methods=['DELETE'])
@login_required
def deleteGroup(id):
    deletedgroup = Group.query.get(id)
    db.session.delete(deletedgroup)
    db.session.commit()
    deletedgroupDict = deletedgroup.to_dict()
    return deletedgroupDict
