from flask import Blueprint, jsonify, request
from app.models import db, Group, User, users_groups, Expense
from flask_login import current_user, login_required
from ..forms import GroupForm

groups = Blueprint('groups', __name__)



# #get all groups with users info (friends)
# @groups.route('/all')
# @login_required
# def allGroupsWithUserInfo():

#     '''get all groups'''
#     '''get current user and select groups column, and create a groups List to print out each group'''
#     id = current_user.id
#     user = User.query.get(id)
#     groups = user.groups
#     groupsList = [group.to_dict() for group in groups]


#     '''add userinfo in groupsList'''
#     for group in groupsList:
#         print(f"1.哪一個group {group}")

#         eachGrouplist= Group.query.get(group['id'])
#         print(f"2.想看看i need to see eachGrouplist {eachGrouplist}")
#         usersList = [user.to_dict() for user in eachGrouplist.users]
#         print(f"3.看看i need to see usersList {usersList}")

#         group['userinfo'] = usersList

#     print(f"想看看i need to see allusers {groupsList}")

#     return groupsList

#get all groups with group members
@groups.route('/all')
@login_required
def allGroupsWithUserInfo():

    '''get all groups'''
    allgroups = Group.query.all()

    '''iterate through allgroups and add group members to each group'''
    groups = []
    for group in allgroups:
        group_data = group.to_dict()

        group_members= group.users
        group_membersDict= [member.to_dict() for member in group_members]


        group_data['group_members'] = group_membersDict
        groups.append(group_data)

    return groups

#get a single group with user info
@groups.route('/<int:id>')
@login_required
def singleGroup(id):
    group = Group.query.get(id)
    groupDict = group.to_dict()
    print("single group: ", groupDict)

    singlegroup_withusers = group.users
    print("BEFORE singlegroup_withusers: ", singlegroup_withusers)
    usersList = [user.to_dict() for user in singlegroup_withusers]
    groupid_with_usersList = {}
    groupid_with_usersList[id] = usersList
    print("AFTER usersList: ", groupid_with_usersList)

    return groupid_with_usersList


# #get a single group
# @groups.route('/<int:id>')
# @login_required
# def singleGroup(id):
#     group = Group.query.get(id)
#     groupDict = group.to_dict()
#     print("single group: ", groupDict)

#     return groupDict


# #get a group with all expenses under the group
# @groups.route('/<int:id>')
# @login_required
# def singleGroup(id):

#     # 找尋Expenses使用 Groupid尋找，找出對應的expense並轉Dict
#     expenses = Expense.query.filter(Expense.group_id == id).all()
#     expensesDict = [expense.to_dict() for expense in expenses]

#     # 使用迴圈找出 User資料庫內的Payer_user_id欄位，並將PayerUser回存expense資料
#     for expense in expensesDict:
#         billpayer = User.query.get(expense['payer_user_id'])
#         expense['billpayer'] = billpayer.to_dict()

#     # 搜尋Group id, 找出Group dict
#     group = Group.query.get(id)
#     groupDict = group.to_dict()

#     # 將GroupDict加入ExpensesDict
#     groupDict['expenses'] = expensesDict

#     print("abcd123e: ", groupDict)

#     return groupDict



#create a group
@groups.route('', methods=['POST'])
@login_required
def createGroup():
    # form = GroupForm()
    form = GroupForm.from_json(request.json)
    form['csrf_token'].data = request.cookies['csrf_token']


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
            new_users_groups = users_groups.insert().values(
                user_id = member["member_id"],
                group_id = new_group.id
            )
            db.session.execute(new_users_groups)
            db.session.commit()


        '''query all group members and add related columns to return'''
        new_group_members = new_group.users
        new_group_membersDict = [member.to_dict() for member in new_group_members]
        new_groupDict = new_group.to_dict()
        new_groupDict["group_members"] = new_group_membersDict


        return new_groupDict

    return form.errors


#update a group- rename and update group members
@groups.route('/<int:id>', methods=['PUT'])
@login_required
def updateGroup(id):
    '''query updatedgroup from db'''
    # form = GroupForm()
    form = GroupForm.from_json(request.json)
    form['csrf_token'].data = request.cookies['csrf_token']
    updatedgroup = Group.query.get(id)

    if form.validate_on_submit():
        '''update group name'''
        updatedgroup.name = form.data['name']
        db.session.commit()


        '''query all members from users_groups, delete all and re-insert user input to users_groups'''
        delete_members = users_groups.delete().where(users_groups.c.group_id == updatedgroup.id)
        db.session.execute(delete_members)

        for member in form.data["group_members"]:
            print(f"here's member {member}")
            new_users_groups = users_groups.insert().values(
                group_id = updatedgroup.id,
                user_id = member["member_id"]
            )
            db.session.execute(new_users_groups)
            db.session.commit()

        print(f"check updatedgroup's users {updatedgroup.users}")
        formated_group_members =[]
        for member in updatedgroup.users:
            print(f"this is updatedgroup member {member}")
            formated_group_members.append(member.to_dict())

        updatedgroupDict = updatedgroup.to_dict()
        print(f"print out formated_group_members {formated_group_members}")
        updatedgroupDict["group_members"] = formated_group_members

        return updatedgroupDict
    return form.errors


#delete a group
@groups.route('/<int:id>', methods=['DELETE'])
@login_required
def deleteGroup(id):
    deletedgroup = Group.query.get(id)
    db.session.delete(deletedgroup)
    db.session.commit()
    deletedgroupDict = deletedgroup.to_dict()
    return deletedgroupDict
