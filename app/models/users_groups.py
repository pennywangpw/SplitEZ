from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.schema import Column, ForeignKey, Table
from sqlalchemy import Integer


Base = declarative_base()


users_groups = db.Table(
    "users_groups",
    db.Model.metadata,
    db.Column("user_id", db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), primary_key=True),
    db.Column("group_id", db.Integer, db.ForeignKey(add_prefix_for_prod("groups.id")), primary_key=True))

if environment == "production":
    users_groups.schema = SCHEMA
