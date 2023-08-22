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
    print(f'#######create group--before {form.data}')

    if form.validate_on_submit():
        print(f'#######create group--this is form.data {form.data}')
        '''create a new group and store in db'''
        new_group = Group(
            name= form.data['name']
        )
        db.session.add(new_group)
        db.session.commit()

        # '''iterate through user input(group members)'''
        # '''insert group members in relationship table- users_groups'''
        # for member in form.data['group_members']:
        #     users_groups.insert().values(
        #         user_id = member.id,
        #         group_id = new_group.id
        #     )
        # db.session.execute(users_groups)
        # db.session.commit()

        # '''query all group members'''
        # group_members= db.session.query(users_groups).filter_by(group_id = new_group.id).all()
        # print(f'all group_members {group_members}')

        # '''append current_user table to users columns'''
        # new_group.users.append(current_user)
        # db.session.commit()
        return new_group.to_dict()
    return form.errors


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
