from app.models import db, environment, SCHEMA
from app.models.users_groups import users_groups
from sqlalchemy.sql import text


def seed_users_group_tables():
    user_group_data = [
        {'user_id': 1, 'group_id':1},
        {'user_id': 1, 'group_id':2},
        {'user_id': 2, 'group_id':3},
    ]

    user_group_rows = []
    for data in user_group_data:
        user_group_rows.append(data)
    db.session.execute(users_groups.insert().values(user_group_rows))
    db.session.commit()


def undo_users_group_tables():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tasks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tables"))

    db.session.commit()



# def seed_users_group_tables():
#     user_group1 = users_groups(user_id='1', group_id=1)
#     user_group2 = users_groups(user_id='1', group_id=2)
#     user_group3 = users_groups(user_id='2', group_id=1)


#     db.session.add(user_group1)
#     db.session.add(user_group2)
#     db.session.add(user_group3)
#     db.session.commit()


# def undo_users_group_tables():
#     if environment == "production":
#         db.session.execute(f"TRUNCATE table {SCHEMA}.tasks RESTART IDENTITY CASCADE;")
#     else:
#         db.session.execute(text("DELETE FROM tables"))

#     db.session.commit()
