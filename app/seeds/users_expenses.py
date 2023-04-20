from app.models import db, environment, SCHEMA
from app.models.users_expenses import users_expenses

from sqlalchemy.sql import text


def seed_tables():
    user_expense_data = [
        {'owe_id': 1, 'expense_id':1},
        {'owe_id': 1, 'expense_id':2},
        {'owe_id': 2, 'expense_id':3},
    ]

    user_expense_rows = []
    for data in user_expense_data:
        user_expense_rows.append(data)
    db.session.execute(users_expenses.insert().values(user_expense_rows))
    db.session.commit()


def undo_tables():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tasks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tables"))

    db.session.commit()




# def seed_tables():
#     owe_expense1 = users_expenses(owe_id='1', expense_id=1)
#     owe_expense2 = users_expenses(owe_id='1', expense_id=2)
#     owe_expense3 = users_expenses(owe_id='2', expense_id=3)


#     db.session.add(owe_expense1)
#     db.session.add(owe_expense2)
#     db.session.add(owe_expense3)
#     db.session.commit()


# def undo_tables():
#     if environment == "production":
#         db.session.execute(f"TRUNCATE table {SCHEMA}.tasks RESTART IDENTITY CASCADE;")
#     else:
#         db.session.execute(text("DELETE FROM tables"))

#     db.session.commit()
