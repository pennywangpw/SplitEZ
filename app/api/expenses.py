from flask import Blueprint, jsonify, request
from app.models import db, Expense, User
from flask_login import current_user, login_required
from ..forms import ExpenseForm

expenses = Blueprint('expenses', __name__)


#get all expenses
@expenses.route('/all')
@login_required
def allExpenses():
    id = current_user.id
    '''get all expenses belong to current user'''
    # expensepool = Expense.query.all()
    # print("-----------pool: ", expensepool)
    allexpenses = Expense.query.filter(
        Expense.payer_user_id == id).all()
    print("----------only belongs to me: ", allexpenses)


    '''get each expense billpayer's information and add this attribute to each expense'''
    allexpenseswithbillpayer=[]
    for expense in allexpenses:
        print("******each expense*: ", expense)
        expense_data = expense.to_dict()
        print("******each expense*: ", expense_data)

        expense_data['billpayer'] = expense.user.to_dict()
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
@login_required
def crateExpense():
    form = ExpenseForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    print(f'BEFORE this is create expenses form {form}')
    if form.validate_on_submit():
        print("AM I PASSING? with form.data:", form.data )
        new_expense = Expense(
            name= form.data['name'],
            expense_total = form.data['expense_total'],
            # payer_user_id = current_user.id,
            payer_user_id = form.data['billpayer'],
            group_id = form.data['group_id'],
            expense_date = form.data['expense_date']
        )
        db.session.add(new_expense)
        db.session.commit()
        print(f'this is create expenses new_expense {new_expense}')
        return new_expense.to_dict()
    return "Bad Data"

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
    form = ExpenseForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    updatedexpense = Expense.query.get(id)
    print(f'update an expense see type {updatedexpense}')
    # updatedexpenseDict = updatedexpense.to_dict()
    # print(f'update an expense {updatedexpenseDict}')
    print(f'this is form.data {form.data}')
    if form.validate_on_submit():
        updatedexpense.name = form.data['name']
        updatedexpense.expense_total = form.data['expense_total']
        updatedexpense.group_id = form.data['group_id']

        db.session.commit()
        updatedexpenseDict = updatedexpense.to_dict()
        return updatedexpenseDict
    return "Bad data-update an expense"
