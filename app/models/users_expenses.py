from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.schema import Column, ForeignKey, Table
from sqlalchemy import Integer



Base = declarative_base()


users_expenses = db.Table(
    "users_expenses",
    db.Model.metadata,
    db.Column("owe_id", db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), primary_key=True),
    db.Column("expense_id", db.Integer, db.ForeignKey(add_prefix_for_prod("expenses.id")), primary_key=True),
    db.Column("amount_payable", db.Numeric)
    )


if environment == "production":
   users_expenses.schema = SCHEMA
