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
    allexpenses = Expense.query.filter(
        Expense.payer_user_id == id).all()

    '''get each expense billpayer's username by matching payer_user_id equals to user.id'''
    allusers=[]
    for expense in allexpenses:
        print("******each expense*: ", expense)
        username = User.query.get(expense.payer_user_id)
        usernameDict = username.to_dict()
        allusers.append(usernameDict['username'])


    expensesList=[expense.to_dict() for expense in allexpenses]

    # '''add on username attribute in the promise'''
    # for expense in expensesList:
    #     t = 0
    #     expense['username'] = allusers[t]
    #     t += 1

    return expensesList


#get a single expense
@expenses.route('/<int:id>')
@login_required
def singleExpense(id):
    expense = Expense.query.get(id)
    print(f'single expnese {expense}')
    expenseDict = expense.to_dict()
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
            payer_user_id = current_user.id,
            group_id = form.data['group_id']
        )
        db.session.add(new_expense)
        db.session.commit()
        print(f'this is create expenses new_expense {new_expense}')
        return new_expense.to_dict()
    return "Bad Data"

#delete an expense
@expenses.route('/all', methods=['DELETE'])
# @expenses.route('/<int:id>', methods=['DELETE'])
@login_required
def deleteExpense(id):
    deletedexpense = Expense.query.get(id)
    db.session.delete(deletedexpense)
    db.session.commit()
    deletedexpenseDict = deletedexpense.to_dict()
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
        db.session.commit()
        updatedexpenseDict = updatedexpense.to_dict()
        return updatedexpenseDict
    return "Bad data-update an expense"
