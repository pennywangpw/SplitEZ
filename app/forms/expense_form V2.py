from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateField, DecimalField, FormField, FieldList
from wtforms.validators import DataRequired
import wtforms_json
wtforms_json.init()


class ExpenseForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    expense_date = DateField('expense_date')
    expense_total = DecimalField('expense_total', validators=[DataRequired()])
    payer_user_id = IntegerField('payer_user_id')
    group_id = IntegerField('group_id')



class DebtorDetailForm(FlaskForm):
    debtor_id = IntegerField('debtor_id', validators=[DataRequired()])
    owe_amount = DecimalField('expense_total', validators=[DataRequired()])


class DebtorsForm(FlaskForm):
    debtors = FieldList(FormField(DebtorDetailForm),min_entries=1)
