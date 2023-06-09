from app.models import db, Group, environment, SCHEMA
from sqlalchemy.sql import text


def seed_groups():
    group1 = Group(name='1635 Ave')
    group2 = Group(name='Snowboarding')
    group3 = Group(name='Board Game')
    group4 = Group(name='Squad lol')
    group5 = Group(name='Camping')
    group6 = Group(name='Church')



    db.session.add(group1)
    db.session.add(group2)
    db.session.add(group3)
    db.session.add(group4)
    db.session.add(group5)
    db.session.add(group6)

    db.session.commit()


def undo_groups():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.groups RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM groups"))

    db.session.commit()
