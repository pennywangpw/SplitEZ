from app.models import db, Expense, environment, SCHEMA
from sqlalchemy.sql import text


def seed_expenses():
    gocery1 = Expense(name='Trader Joe', expense_total=40, payer_user_id=1)
    gocery2 = Expense(name='Costco', expense_total=130, payer_user_id=2)
    gocery3 = Expense(name='H mart', expense_total=68, payer_user_id=1)
    gocery4 = Expense(name='hotel', expense_total=345.69, payer_user_id=1,group_id= 1)
    gocery5 = Expense(name='ticket', expense_total=288.30, payer_user_id=1, group_id =1)
    gocery6 = Expense(name='bottle', expense_total=22.12, payer_user_id=1, group_id= 2)




    db.session.add(gocery1)
    db.session.add(gocery2)
    db.session.add(gocery3)
    db.session.add(gocery4)
    db.session.add(gocery5)
    db.session.add(gocery6)
    db.session.commit()


def undo_expenses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.expenses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM expenses"))

    db.session.commit()
