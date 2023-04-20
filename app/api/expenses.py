from flask import Blueprint, jsonify, request
from app.models import db, Expense
from flask_login import current_user, login_required
from ..forms import ExpenseForm

expenses = Blueprint('expenses', __name__)


#get all expenses
@expenses.route('/all')
@login_required
def allExpenses():
    id = current_user.id
    allexpenses = Expense.query.filter(Expense.payer_user_id == id).all()
    expensesList={}
    expensesList['expenses']=[expense.to_dict() for expense in allexpenses]
    return expensesList

#get a single expense
@expenses.route('/<int:expenseid>')
@login_required
def singleExpense():


#create an expense
@expenses.route('/all', methods=['POST'])
@login_required
def crateExpense():
    form = ExpenseForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    print(f'BEFORE this is create expenses form {form}')
    if form.validate_on_submit():
        new_expense = Expense(
            name= form.data['name'],
            expense_total = form.data['expense_total'],
            payer_user_id = form.data['payer_user_id'],
            group_id = form.data['group_id']
        )
        db.session.add(new_expense)
        db.session.commit()
        print(f'this is create expenses new_expense {new_expense}')
        return new_expense.to_dict()
    return "Bad Data"
