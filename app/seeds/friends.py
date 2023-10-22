from app.models import db, Friend, environment, SCHEMA
from sqlalchemy.sql import text


def seed_friends():
    friend1 = Friend(name='Demo',friend_id= 1, belongs_to_user_id= 2, nickname ="Dmo")
    friend2 = Friend(name='tracy', friend_id= 5, belongs_to_user_id= 2)
    friend3 = Friend(name='jack',friend_id= 6, belongs_to_user_id= 2)
    friend4 = Friend(name='bobbie',friend_id= 3, belongs_to_user_id= 2)
    friend5 = Friend(name='Demo',friend_id= 1, belongs_to_user_id= 3, nickname ="DD")
    friend6 = Friend(name='Demo',friend_id= 1, belongs_to_user_id= 4, nickname ="mo")






    db.session.add(friend1)
    db.session.add(friend2)
    db.session.add(friend3)
    db.session.add(friend4)
    db.session.add(friend5)
    db.session.add(friend6)




    db.session.commit()


def undo_friends():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.groups RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM groups"))

    db.session.commit()
