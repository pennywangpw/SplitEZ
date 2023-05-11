from flask import Blueprint, jsonify, request
from app.models import db, Group, User, users_groups, Expense
from flask_login import current_user, login_required
from ..forms import GroupForm

groups = Blueprint('groups', __name__)



#get all groups
@groups.route('/all')
@login_required
def allGroups():
    '''get all groups belong to current user'''
    id = current_user.id
    user = User.query.get(id)
    groups = user.groups
    groupsList = [group.to_dict() for group in groups]
    print(f"i need to see groupsList {groupsList}")
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

#get a single group
@groups.route('/<int:id>')
@login_required
def singleGroup(id):
    group = Group.query.get(id)
    groupDict = group.to_dict()
    print("single group: ", groupDict)

    return groupDict

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

# #get a group with all expenses under the group
# @groups.route('/<int:id>')
# @login_required
# def singleGroup(id):
#     group = Group.query.get(id)
#     groupDict = group.to_dict()

#     query = db.session.query(Expense, User).join(User, Expense.payer_user_id == User.id).filter(Expense.group_id == id).all()

#     expensesDict = []
#     for expense, user in query:
#         expenseDict = expense.to_dict()
#         expenseDict['payer_user'] = user.to_dict()
#         expensesDict.append(expenseDict)

#     groupDict['expenses'] = expensesDict
#     print("abcde: ", groupDict)

#     return groupDict



#create a group
@groups.route('', methods=['POST'])
@login_required
def createGroup():
    form = GroupForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        '''create a new group and store in db'''
        new_group = Group(
            name= form.data['name']
        )
        db.session.add(new_group)
        db.session.commit()

        '''append current_user table to users columns'''
        new_group.users.append(current_user)
        db.session.commit()
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
