from .db import db, environment, SCHEMA, add_prefix_for_prod




class Friend(db.Model):
    __tablename__='friends'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    friend_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    belongs_to_user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    nickname = db.Column(db.String(50))

    '''friend_id'''
    user = db.relationship(
        "User",
        foreign_keys=[friend_id],
        back_populates="friend_id"
    )

    '''belongs_to_user_id'''
    belongs_to_user = db.relationship(
        "User",
        foreign_keys=[belongs_to_user_id],
        back_populates="belongs_to_user_id"
    )

    def to_dict(self):
        return {
            'id': self.id,
            'friend_id': self.friend_id,
            'belongs_to_user_id': self.belongs_to_user_id,
            'nickname': self.nickname
        }
