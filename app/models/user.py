from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .users_groups import users_groups
from .users_expenses import users_expenses


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    image_url = db.relationship(
        "Image",
        back_populates="user"
    )

    comments = db.relationship(
        "Comment",
        back_populates="user"

    )

    payer_user_id = db.relationship(
        "Expense",
        back_populates="user"
    )

    groups = db.relationship(
        "Group",
        secondary=users_groups,
        back_populates="users"

    )

    expenses = db.relationship(
        "Expense",
        secondary=users_expenses,
        back_populates="users"

    )

    friend_id = db.relationship(
        "Friend",
        foreign_keys="Friend.friend_id",
        back_populates="user"
    )

    belongs_to_user_id = db.relationship(
        "Friend",
        foreign_keys="Friend.belongs_to_user_id",
        back_populates="belongs_to_user"
    )

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }
