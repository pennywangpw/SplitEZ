from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateField, DecimalField
from wtforms.validators import DataRequired


class CommentForm(FlaskForm):
    comment = StringField('comment')
    user_id = IntegerField('user_id')
    expense_id = IntegerField('expense_id')
