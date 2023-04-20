from app.models import db, Group, environment, SCHEMA
from sqlalchemy.sql import text


def seed_groups():
    group1 = Group(name='1635 Ave')
    group2 = Group(name='Snowboarding')
    group3 = Group(name='Board Game')


    db.session.add(group1)
    db.session.add(group2)
    db.session.add(group3)
    db.session.commit()


def undo_groups():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tasks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM groups"))

    db.session.commit()
