from flask import Blueprint, jsonify, request
from app.models import db, Expense, User, users_expenses
from flask_login import current_user, login_required
from ..forms import ExpenseForm, DebtorDetailForm
from sqlalchemy.orm import aliased

expenses = Blueprint('expenses', __name__)


#get all expenses
@expenses.route('/all')
@login_required
def allExpenses():
    '''get all expenses from db'''
    allexpenses = Expense.query.all()

    '''iterate through all Expenses from db to add debtors information'''
    expenses = []
    for expense in allexpenses:
        expense_data = expense.to_dict()

        '''query users_expenses to get all debtors'''
        debtors = db.session.query(users_expenses).filter_by(expense_id = expense.id).all()
        print(f'0--to check if i get users_expenses with all debtors {debtors}')

        '''iterate through debtors to re-format each debtor and add on expense'''
        debtors_formated = []
        for debtor in debtors:
            debtor_formated ={
                "debtor_id": debtor.owe_id,
                "owe_amount": debtor.amount_payable
            }
            debtors_formated.append(debtor_formated)

        expense_data['debtors'] = debtors_formated
        expenses.append(expense_data)


    print("--------所有的expense ", expenses)

    return expenses


#get a single expense with billpayer AND associated user information
@expenses.route('/<int:id>')
@login_required
def singleExpense(id):
    expense = Expense.query.get(id)
    print(f'single expnese {expense}')
    '''get the billpayer info'''
    billpayer = expense.user
    billpayerDict = billpayer.to_dict()
    print(f'single expnese --billpayer {billpayerDict}')
    '''add billpayer column to expenseDict'''
    expenseDict = expense.to_dict()
    expenseDict['billpayer']=billpayerDict
    # expenseDict['billpayer'].append(billpayerDict)
    # print(f'single expnese --returnning {expenseDict}')

    '''get associated users'''
    associateduser = expense.users
    associateduserDict = [user.to_dict() for user in associateduser]
    print(f'找testing to see associated user: ',associateduserDict)
    '''add associateduser column to expenseDict'''
    expenseDict['associateduser'] = associateduserDict
    print(f'single expnese --returnning {expenseDict}')

    return expenseDict


#create an expense
@expenses.route('/all', methods=['POST'])
def crateExpenseFake():
    '''Create a form with user input'''
    form = ExpenseForm.from_json(request.json)
    form['csrf_token'].data = request.cookies['csrf_token']
    print(f"this is form data when i create expense {form.data}")
    '''check if form passes validation, if so, create an Expense and store in db'''
    if form.validate_on_submit():
        new_expense = Expense(
            name = form.data['name'],
            expense_date = form.data['expense_date'],
            expense_total = form.data['expense_total'],
            payer_user_id = form.data['payer_user_id'],
            group_id = form.data['group_id']
        )

        db.session.add(new_expense)
        db.session.commit()

        '''iterate through user input (debtors)'''
        '''insert debtors in relationship table - users_expenses'''
        for debtor in form.data['debtors']:
            print(f"here's debtor in form.data {debtor}")
            new_users_expenses = users_expenses.insert().values(
                owe_id = debtor["debtor_id"],
                expense_id = new_expense.id,
                amount_payable = debtor["owe_amount"]
            )
            # db.session.add(new_users_expenses)
            db.session.execute(new_users_expenses)
            db.session.commit()



        new_expense_usersDict=[user.to_dict() for user in new_expense.users]


        '''query all debtors from db and add related columns'''
        debtors = db.session.query(users_expenses).filter_by(expense_id = new_expense.id).all()
        print(f'create {debtors}')
        debtors_formated = []
        for debtor in debtors:
            debtor_formated ={
                "debtor_id": debtor.owe_id,
                "owe_amount": debtor.amount_payable
            }
            debtors_formated.append(debtor_formated)

        new_expenseDict = new_expense.to_dict()
        new_expenseDict["debtors"] = debtors_formated

        return new_expenseDict

    else:
        return form.errors



# #create an expense
# @expenses.route('/all', methods=['POST'])
# @login_required
# def crateExpense():
#     form = ExpenseForm()
#     form['csrf_token'].data = request.cookies['csrf_token']
#     print(f'BEFORE this is create expenses form {form}')
#     data = request.get_json()
#     print(f'data is here {data}')

#     if form.validate_on_submit():
#         print("AM I PASSING? with form.data:", form.data )
#         new_expense = Expense(
#             name= form.data['name'],
#             expense_total = form.data['expense_total'],
#             # payer_user_id = current_user.id,
#             payer_user_id = form.data['payer_user_id'],
#             group_id = form.data['group_id'],
#             expense_date = form.data['expense_date']
#         )

#         db.session.add(new_expense)

#         for user_id in data['splitWithUsers']:
#             user = User.query.get(user_id)
#             if user:
#                 new_expense.users.append(user)

#         db.session.commit()



#         print(f'this is create expenses new_expense {new_expense}')
#         return new_expense.to_dict()
#     return "Bad Data"

#delete an expense
# @expenses.route('/all', methods=['DELETE'])
@expenses.route('/<int:id>', methods=['DELETE'])
@login_required
def deleteExpense(id):
    deletedexpense = Expense.query.get(id)
    print("i think i tested this-1 ", deletedexpense)
    deletedexpenseDict = deletedexpense.to_dict()
    db.session.delete(deletedexpense)
    print("i think i tested this-2 ")

    db.session.commit()

    print("i think i tested this, ", deletedexpenseDict)
    return deletedexpenseDict

#update an expense
@expenses.route('/<int:id>', methods=['PUT'])
@login_required
def updatedExpense(id):
    form = ExpenseForm.from_json(request.json)
    form['csrf_token'].data = request.cookies['csrf_token']


    '''check if form is validate'''
    if form.validate_on_submit():
        '''query db to get the expense which the user wants to update'''
        updatedexpense = Expense.query.get(id)
        print(f"2-----check if i query updatedexpense {updatedexpense}")
        print(f"2-----check if i query updatedexpense to dict{updatedexpense.to_dict()}")


        # '''update the value with user input'''
        # updatedexpense.name = form.data['name']
        # updatedexpense.expense_total = form.data['expense_total']
        # updatedexpense.group_id = form.data['group_id']
        # updatedexpense.expense_date = form.data['expense_date']
        # updatedexpense.payer_user_id = form.data['payer_user_id']
        # debtors = form.data['debtors']

        '''access all debtors by users_expenses'''
        debtors = db.session.query(users_expenses).filter_by(expense_id = updatedexpense.id).all()





        '''先刪掉再加回來'''
        # db.session.delete(users_expenses).where(expense_id = id)
        # for debtor in debtors:
        #     db.session.delete(debtor)


        # updatedexpenseDict["name"] = form.data['name']
        # updatedexpenseDict["expense_total"] = form.data['expense_total']
        # updatedexpenseDict["group_id"] = form.data['group_id']
        # updatedexpenseDict["expense_date"] = form.data['expense_date']
        # updatedexpenseDict["payer_user_id"] = form.data['payer_user_id']
        # print(f"AFTER UPDATING THE INFO {updatedexpenseDict}")

        db.session.commit()
        return updatedexpense.to_dict()


    # t = db.session.query(users_expenses).filter_by(owe_id=200, expense_id=22).one()
    # print(t.owe_id)
    # print(t.expense_id)
    # a = {
    #     'owe_id': t.owe_id,
    #     'expenses_id': t.expense_id
    # }
    # print(a)
    return form.errors



    # form = ExpenseForm()
    # form['csrf_token'].data = request.cookies['csrf_token']
    # updatedexpense = Expense.query.get(id)
    # print(f'--update an expense see type {updatedexpense}')
    # # updatedexpenseDict = updatedexpense.to_dict()
    # # print(f'update an expense {updatedexpenseDict}')
    # print(f'this is form.data {form.data}')
    # if form.validate_on_submit():
    #     updatedexpense.name = form.data['name']
    #     updatedexpense.expense_total = form.data['expense_total']
    #     updatedexpense.group_id = form.data['group_id']
    #     updatedexpense.expense_date = form.data['expense_date']
    #     updatedexpense.payer_user_id = form.data['payer_user_id']
    #     updatedexpense.debtors = form.data['debtors']



    #     db.session.commit()
    #     updatedexpenseDict = updatedexpense.to_dict()
    #     return updatedexpenseDict
    # return "Bad data-update an expense"
