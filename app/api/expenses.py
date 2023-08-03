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
    # id = current_user.id
    # '''get all expenses belong to current user'''
    # # expensepool = Expense.query.all()
    # # print("-----------pool: ", expensepool)
    # allexpenses = Expense.query.filter(
    #     Expense.payer_user_id == id).all()
    # print("----------only belongs to me: ", allexpenses)

    '''get all expenses'''
    allexpenses = Expense.query.all()


    '''get each expense billpayer's information and add this attribute to each expense'''
    allexpenseswithbillpayer=[]
    for expense in allexpenses:
        print("******each expense*: ", expense)
        expense_data = expense.to_dict()
        print("******each expense*: ", expense_data)

        expense_data['billpayer'] = expense.user.to_dict()
        print("expense.user.to_dict(): ",expense.user.to_dict())
        allexpenseswithbillpayer.append(expense_data)

    print("==============================",allexpenseswithbillpayer)
    print("--------AFTER only belongs to me: ", allexpenses)
    return {'allexpenses_with_billpayer':allexpenseswithbillpayer}



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
    '''check if form is validate or not'''
    form = ExpenseForm.from_json(request.json)
    form['csrf_token'].data = request.cookies['csrf_token']
    print(f"check if convert into JSON {form}")


    if form.validate_on_submit():
        '''query db to get the expense which the user might want to update'''
        updatedexpense = Expense.query.get(id)
        print(f"2-----check if i query updatedexpense {updatedexpense}")

        '''query db to get the debtors which the user might want to update'''
        debtors = db.session.query(users_expenses).filter_by(expense_id = id).all()

        print(f"1.-----check if i query debtors {debtors}")

        '''update the value with user input'''
        updatedexpense.name = form.data['name']
        updatedexpense.expense_total = form.data['expense_total']
        updatedexpense.group_id = form.data['group_id']
        updatedexpense.expense_date = form.data['expense_date']
        updatedexpense.payer_user_id = form.data['payer_user_id']


        '''先刪掉再加回來'''
        # db.session.delete(users_expenses).where(expense_id = id)
        # for debtor in debtors:
        #     db.session.delete(debtor)

        '''找到後重新assign'''
        for debtor in debtors:
            debtor[0] = form.data["debtors"]["debtor_id"]
            debtor[2] = form.data["debtors"]["owe_amount"]



        # updatedexpenseDict["name"] = form.data['name']
        # updatedexpenseDict["expense_total"] = form.data['expense_total']
        # updatedexpenseDict["group_id"] = form.data['group_id']
        # updatedexpenseDict["expense_date"] = form.data['expense_date']
        # updatedexpenseDict["payer_user_id"] = form.data['payer_user_id']
        # print(f"AFTER UPDATING THE INFO {updatedexpenseDict}")

        db.session.commit()



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
