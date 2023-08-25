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

    return expenses


#get a single expense with billpayer AND associated user information
@expenses.route('/<int:id>')
@login_required
def singleExpense(id):
    '''query the expense which user wants to see from db'''
    expense = Expense.query.get(id)
    expenseDict = expense.to_dict()

    '''query users_expenses to get all debtors'''
    debtors = db.session.query(users_expenses).filter_by(expense_id = expense.id).all()

    '''iterate through debtors to re-format each debtor and add on expense'''
    debtors_formated = []
    for debtor in debtors:
        debtor_formated ={
            "debtor_id": debtor.owe_id,
            "owe_amount": debtor.amount_payable
        }
        debtors_formated.append(debtor_formated)

    expenseDict['debtors'] = debtors_formated

    return expenseDict


#create an expense
@expenses.route('', methods=['POST'])
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
            db.session.execute(new_users_expenses)
            db.session.commit()


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



#delete an expense
@expenses.route('/<int:id>', methods=['DELETE'])
@login_required
def deleteExpense(id):
    '''query the expense which the user wants to delete from db'''
    deleted_expense = Expense.query.get(id)
    print("i think i tested this-1 ", deleted_expense)

    if deleted_expense is not None:
        '''query users_expenses to get all debtors'''
        debtors = db.session.query(users_expenses).filter_by(expense_id = deleted_expense.id).all()

        '''iterate through debtors to re-format each debtor and add on expense'''
        debtors_formated = []
        for debtor in debtors:
            debtor_formated ={
                "debtor_id": debtor.owe_id,
                "owe_amount": debtor.amount_payable
            }
            debtors_formated.append(debtor_formated)

        deleted_expenseDict = deleted_expense.to_dict()
        deleted_expenseDict['debtors'] = debtors_formated

        '''delete the expense'''
        db.session.delete(deleted_expense)
        db.session.commit()

        return deleted_expenseDict
    return "The expense does not exisit"


#update an expense- expense name, total, data, group_id, payer_user_id can be updated
@expenses.route('/<int:id>', methods=['PUT'])
@login_required
def updatedExpense(id):
    form = ExpenseForm.from_json(request.json)
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():

        '''query db to get the expense which the user wants to update'''
        updated_expense = Expense.query.get(id)

        # update the value with user input-all information except debtors
        updated_expense.name = form.data['name']
        updated_expense.expense_total = form.data['expense_total']
        updated_expense.group_id = form.data['group_id']
        updated_expense.expense_date = form.data['expense_date']
        updated_expense.payer_user_id = form.data['payer_user_id']

        # update the value with user input-debtors information
        '''access all debtors by users_expenses and delete all debtors'''
        delete_debtors = users_expenses.delete().where(users_expenses.c.expense_id == updated_expense.id)
        db.session.execute(delete_debtors)
        db.session.commit()

        '''re-insert debtors with user input'''
        for debtor in form.data['debtors']:
            new_users_expenses = users_expenses.insert().values(
                owe_id = debtor["debtor_id"],
                expense_id = updated_expense.id,
                amount_payable = debtor["owe_amount"]
            )
            db.session.execute(new_users_expenses)
            db.session.commit()

        '''query all debtors from db and format debtors data'''
        debtors = db.session.query(users_expenses).filter_by(expense_id = updated_expense.id).all()
        debtors_formated = []
        for debtor in debtors:
            debtor_formated ={
                "debtor_id": debtor.owe_id,
                "owe_amount": debtor.amount_payable
            }
            debtors_formated.append(debtor_formated)

        updated_expenseDict = updated_expense.to_dict()
        updated_expenseDict["debtors"] = debtors_formated

        return updated_expenseDict

    # t = db.session.query(users_expenses).filter_by(owe_id=200, expense_id=22).one()
    # print(t.owe_id)
    # print(t.expense_id)
    # a = {
    #     'owe_id': t.owe_id,
    #     'expenses_id': t.expense_id
    # }
    # print(a)
    return form.errors
