from app.models import db, Expense, environment, SCHEMA
from sqlalchemy.sql import text


def seed_expenses():
    gocery1 = Expense(name='Trader Joe', expense_total=40, payer_user_id=1)
    gocery2 = Expense(name='Costco', expense_total=130, payer_user_id=2)
    gocery3 = Expense(name='H mart', expense_total=68, payer_user_id=1)


    db.session.add(gocery1)
    db.session.add(gocery2)
    db.session.add(gocery3)
    db.session.commit()


def undo_expenses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tasks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM expenses"))

    db.session.commit()
