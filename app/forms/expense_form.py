from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateField, DecimalField
from wtforms.validators import DataRequired


class ExpenseForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    expense_date = DateField('expense_date')
    expense_total = DecimalField('expense_total', validators=[DataRequired()])
    payer_user_id = IntegerField('payer_user_id')
    group_id = IntegerField('group_id')
