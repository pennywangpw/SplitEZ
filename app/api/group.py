from flask import Blueprint, jsonify, request
from app.models import db, Group, User, users_groups, Expense
from flask_login import current_user, login_required
from ..forms import GroupForm

groups = Blueprint('groups', __name__)



#get all groups with group members
#[{name,id, group_members:[{emil,id,username}...]}...]
@groups.route('/all')
@login_required
def allGroupsWithUserInfo():

    '''get all groups belongs to the current user'''
    allgroups = Group.query.all()


    '''iterate through allgroups and get associated users for each group '''
    groups = []

    allgroupsDict = [group.to_dict() for group in allgroups]
    allusers_in_each_group = [group.users for group in allgroups]

    '''iterate through allusers_in_each_group to add group members to each group '''
    for i in range(len(allusers_in_each_group)):
        if current_user in allusers_in_each_group[i]:
            allgroupsDict[i]['group_members'] = [group_member.to_dict() for group_member in allusers_in_each_group[i]]
            groups.append(allgroupsDict[i])

    return groups

#get a single group
#groupId:[{emil,id,username}...]
@groups.route('/<int:id>')
@login_required
def singleGroup(id):
    '''find the specific group'''
    group = Group.query.get(id)
    group_data = group.to_dict()

    group_members = group.users

    group_membersDict = [user.to_dict() for user in group_members]
    group_data['group_members'] = group_membersDict

    return group_data

# #get a single group with user info
# #groupId:[{emil,id,username}...]
# @groups.route('/<int:id>')
# @login_required
# def singleGroup(id):
#     group = Group.query.get(id)
#     groupDict = group.to_dict()
#     print("single group: ", groupDict)

#     singlegroup_withusers = group.users
#     print("BEFORE singlegroup_withusers: ", singlegroup_withusers)
#     usersList = [user.to_dict() for user in singlegroup_withusers]
#     groupid_with_usersList = {}
#     groupid_with_usersList[id] = usersList
#     print("AFTER usersList: ", groupid_with_usersList)

#     return groupid_with_usersList


#create a group
@groups.route('', methods=['POST'])
@login_required
def createGroup():
    # form = GroupForm()
    form = GroupForm.from_json(request.json)
    form['csrf_token'].data = request.cookies['csrf_token']
    print(f"GROUP-REQUEST.JSON{request.json}")
    print(f"GROUP-form{form}")


    if form.validate_on_submit():
        '''create a new group and store in db'''
        new_group = Group(
            name= form.data['name']
        )
        db.session.add(new_group)
        db.session.commit()


        '''iterate through user input(group members)'''
        '''insert group members in relationship table- users_groups'''
        for member in form.data['group_members']:
            ''''check the condition before adding to db'''
            if member["id"] is not None:
                new_users_groups = users_groups.insert().values(
                    user_id = member["id"],
                    group_id = new_group.id
                )
                db.session.execute(new_users_groups)
                db.session.commit()


        '''format group_members information and add on res'''
        new_group_members = new_group.users
        new_group_membersDict = [member.to_dict() for member in new_group_members]
        new_groupDict = new_group.to_dict()
        new_groupDict["group_members"] = new_group_membersDict


        return new_groupDict

    return form.errors

#update a group- name (only change name)
@groups.route('/<int:id>', methods=['PUT'])
@login_required
def updateGroup(id):
    '''query updatedgroup from db by id which user wants to update'''
    # form = GroupForm()
    form = GroupForm.from_json(request.json)
    form['csrf_token'].data = request.cookies['csrf_token']
    updatedgroup = Group.query.get(id)

    if form.validate_on_submit():

        '''update group name'''
        updatedgroup.name = form.data['name']
        db.session.commit()

        updatedgroupDict = updatedgroup.to_dict()

        return updatedgroupDict

    return form.errors

# #update a group- name and group members (both data are required)
# @groups.route('/<int:id>', methods=['PUT'])
# @login_required
# def updateGroup(id):
#     '''query updatedgroup from db by id which user wants to update'''
#     # form = GroupForm()
#     form = GroupForm.from_json(request.json)
#     form['csrf_token'].data = request.cookies['csrf_token']
#     updatedgroup = Group.query.get(id)

#     if form.validate_on_submit():
#         '''update group name'''
#         updatedgroup.name = form.data['name']
#         db.session.commit()

#         '''query all members from users_groups, delete all and re-insert user input to users_groups'''
#         delete_members = users_groups.delete().where(users_groups.c.group_id == updatedgroup.id)
#         db.session.execute(delete_members)

#         for member in form.data["group_members"]:
#             new_users_groups = users_groups.insert().values(
#                 group_id = updatedgroup.id,
#                 user_id = member["member_id"]
#             )
#             db.session.execute(new_users_groups)
#             db.session.commit()

#         '''format group_members information and add on res'''
#         formated_group_members =[]
#         for member in updatedgroup.users:
#             formated_group_members.append(member.to_dict())

#         updatedgroupDict = updatedgroup.to_dict()
#         updatedgroupDict["group_members"] = formated_group_members

#         return updatedgroupDict

#     return form.errors


#delete a group
@groups.route('/<int:id>', methods=['DELETE'])
@login_required
def deleteGroup(id):
    '''query the group by id which user wants to delete'''
    deletedgroup = Group.query.get(id)

    '''query all members belongs to deletedgroup'''
    '''format group_members information and add on res'''
    if deletedgroup is not None:
        deleted_group_members= deletedgroup.users
        formated_deleted_group_members = []
        for member in deleted_group_members:
            memberDict= member.to_dict()
            formated_deleted_group_members.append(memberDict)

        deletedgroupDict = deletedgroup.to_dict()
        deletedgroupDict["group_members"] = formated_deleted_group_members

        '''delete deletedgroup'''
        db.session.delete(deletedgroup)
        db.session.commit()

        return deletedgroupDict

    return "The group does not exisit"
