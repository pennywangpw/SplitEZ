from app.models import db, Expense, environment, SCHEMA
from sqlalchemy.sql import text


def seed_expenses():
    gocery1 = Expense(name='Trader Joe', expense_total=40, payer_user_id=1)
    gocery2 = Expense(name='Costco', expense_total=130, payer_user_id=1)
    gocery3 = Expense(name='H mart', expense_total=68, payer_user_id=1)
    gocery4 = Expense(name='hotel', expense_total=345.69, payer_user_id=1,group_id= 1)
    gocery5 = Expense(name='ticket', expense_total=288.30, payer_user_id=1, group_id =2)
    gocery6 = Expense(name='bottle', expense_total=22.12, payer_user_id=1, group_id= 2)
    gocery7 = Expense(name='burger', expense_total=34.11, payer_user_id=1, group_id= 3)
    gocery8 = Expense(name='flight ficket', expense_total=600, payer_user_id=1, group_id= 3)
    gocery9 = Expense(name='books', expense_total=64.38, payer_user_id=1, group_id= 4)
    gocery10 = Expense(name='masks', expense_total=22.13, payer_user_id=1, group_id= 4)






    db.session.add(gocery1)
    db.session.add(gocery2)
    db.session.add(gocery3)
    db.session.add(gocery4)
    db.session.add(gocery5)
    db.session.add(gocery6)
    db.session.add(gocery7)
    db.session.add(gocery8)
    db.session.add(gocery9)
    db.session.add(gocery10)

    db.session.commit()


def undo_expenses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.expenses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM expenses"))

    db.session.commit()
