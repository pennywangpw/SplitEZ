from .db import db, environment, SCHEMA, add_prefix_for_prod




class Friend(db.Model):
    __tablename__='friends'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    friend_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('user.id')), nullable=False)
    user = db.relationship(
        "User",
        back_populates="friends"
    )




    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
        }
