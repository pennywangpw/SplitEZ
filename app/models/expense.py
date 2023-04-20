from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .users_expenses import users_expenses



class Expense(db.Model):
    __tablename__ = 'expenses'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    expense_date = db.Column(db.DateTime)
    expense_total = db.Column(db.Numeric, nullable=False)
    payer_user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('groups.id')))

    comments = db.relationship(
        "Comment",
        back_populates="expense"
    )

    user = db.relationship(
        "User",
        back_populates="payer_user_id"
    )

    users = db.relationship(
        "User",
        secondary=users_expenses,
        back_populates="expenses"
    )

    group = db.relationship(
        "Group",
        back_populates="expenses"
    )


    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'created_at': self.created_at,
            'expense_date': self.expense_date,
            'expense_total': self.expense_total,
            'payer_user_id': self.payer_user_id,
            'group_id': self.group_id
        }
