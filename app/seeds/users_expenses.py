from app.models import db, environment, SCHEMA
from app.models.users_expenses import users_expenses

from sqlalchemy.sql import text


def seed_tables():
    user_expense_data = [
        {'owe_id': 1, 'expense_id':1, 'amount_payable': 10},
        {'owe_id': 1, 'expense_id':2, 'amount_payable': 10},
        {'owe_id': 2, 'expense_id':3, 'amount_payable': 10},
        {'owe_id': 2, 'expense_id':4, 'amount_payable': 10},
        {'owe_id': 2, 'expense_id':5, 'amount_payable': 10},
        {'owe_id': 2, 'expense_id':6, 'amount_payable': 10},
        {'owe_id': 2, 'expense_id':7, 'amount_payable': 10},
        {'owe_id': 2, 'expense_id':8, 'amount_payable': 10},
        {'owe_id': 3, 'expense_id':1, 'amount_payable': 10},
        {'owe_id': 3, 'expense_id':2, 'amount_payable': 10},
        {'owe_id': 3, 'expense_id':5, 'amount_payable': 10},
        {'owe_id': 3, 'expense_id':6, 'amount_payable': 10},
        {'owe_id': 3, 'expense_id':7, 'amount_payable': 10},
        {'owe_id': 4, 'expense_id':2, 'amount_payable': 10},
        {'owe_id': 4, 'expense_id':3, 'amount_payable': 10},
        {'owe_id': 4, 'expense_id':4, 'amount_payable': 10},
        {'owe_id': 5, 'expense_id':1, 'amount_payable': 10},
        {'owe_id': 5, 'expense_id':2, 'amount_payable': 10},
        {'owe_id': 5, 'expense_id':3, 'amount_payable': 10},
        {'owe_id': 5, 'expense_id':8, 'amount_payable': 10},

    ]

    user_expense_rows = []
    for data in user_expense_data:
        user_expense_rows.append(data)
    db.session.execute(users_expenses.insert().values(user_expense_rows))
    db.session.commit()


def undo_tables():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users_expenses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users_expenses"))

    db.session.commit()
