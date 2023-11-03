from flask.cli import AppGroup
from .users import seed_users, undo_users
from .expenses import seed_expenses, undo_expenses
from .groups import seed_groups, undo_groups
from .comments import seed_comments, undo_comments
from .users_expenses import seed_tables,undo_tables
from .users_groups import seed_users_group_tables, undo_users_group_tables
from .friends import seed_friends, undo_friends
from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below

        # undo_users()
        # undo_expenses()
        # undo_groups()
        # undo_comments()
        # undo_tables()
        # undo_users_group_tables()
        undo_users_group_tables()
        undo_groups()
        undo_tables()
        undo_comments()
        undo_expenses()
        undo_friends()
        undo_users()

    seed_users()
    seed_friends()
    seed_groups()
    seed_expenses()
    seed_comments()
    seed_tables()
    seed_users_group_tables()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_friends()
    undo_expenses()
    undo_groups()
    undo_comments()
    undo_tables()
    undo_users_group_tables()
    # Add other undo functions here
