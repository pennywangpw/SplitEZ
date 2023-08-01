from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateField, DecimalField, FormField, FieldList
from wtforms.validators import DataRequired, Length, NumberRange
import wtforms_json
wtforms_json.init()

class ExpenseForm(FlaskForm):
    #name validation
    name = StringField('name', validators=[DataRequired(),Length(max =50)])
    #expense_date validation
    expense_date = DateField('expense_date', validators=[DataRequired()])
    #expense_total validation
    expense_total = DecimalField('expense_total', validators=[DataRequired(), NumberRange(min = 0)])
    #payer_user_id validation
    payer_user_id = IntegerField('payer_user_id', validators=[DataRequired()])
    #group_id validation
    group_id = IntegerField('group_id')


#debtor validation
class DebtorDetailForm(FlaskForm):
    class Meta:
        csrf= False
    debtor_id = IntegerField('debtor_id', validators=[DataRequired()])
    owe_amount = DecimalField('owe_amount', validators=[DataRequired()])


class DebtorsForm(FlaskForm):
    debtors = FieldList(FormField(DebtorDetailForm),min_entries=1)
