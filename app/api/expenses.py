from flask import Blueprint
from app.models import db, Expense
from flask_login import current_user, login_required


expenses = Blueprint('expenses', __name__)


#get all expenses
@expenses.route('/')
@login_required
def allExpenses():
    id = current_user.id
    print(f'this is id :{id}')
    allexpenses = Expense.query.filter(Expense.payer_user_id == id).all()
    print(f'this is expense {allexpenses}')
    expensesList={}
    expensesList['expenses']=[expense.to_dict() for expense in allexpenses]
    print(f'this is expenseList {expensesList}')
    return '123'
