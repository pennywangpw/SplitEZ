from .db import db, environment, SCHEMA, add_prefix_for_prod


class Comment(db.Model):
    __tablename__ = 'comments'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String(255))
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
    expense_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('expenses.id')))

    user = db.relationship(
      "User",
      back_populates="comments"
    )

    expense = db.relationship(
        "Expense",
        back_populates="comments"
    )

    def to_dict(self):
        return {
            'id': self.id,
            'comment': self.comment,
            'user_id': self.user_id,
            'expense_id': self.expense_id,
            'user': self.user.to_dict(),
            'expense': self.expense.to_dict()
        }
