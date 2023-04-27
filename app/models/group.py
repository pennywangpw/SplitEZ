from .db import db, environment, SCHEMA, add_prefix_for_prod
from .users_groups import users_groups
from flask_login import UserMixin


class Group(db.Model):
    __tablename__ = 'groups'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, default=1)
    name = db.Column(db.String(100), nullable=False)

    users = db.relationship(
        "User",
        secondary=users_groups,
        back_populates="groups"
    )

    expenses = db.relationship(
        "Expense",
        back_populates="group",
        cascade="all, delete-orphan"
    )



    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
        }
