from app.models import db, Comment, environment, SCHEMA
from sqlalchemy.sql import text


def seed_comments():
    comment1 = Comment(comment='this is testing', user_id=1,expense_id= 1)
    comment2 = Comment(comment="Don't buy any snacks", user_id=2, expense_id=1)
    comment3 = Comment(comment='The bread is yum!',user_id=3, expense_id=2)


    db.session.add(comment1)
    db.session.add(comment2)
    db.session.add(comment3)
    db.session.commit()


def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))

    db.session.commit()
