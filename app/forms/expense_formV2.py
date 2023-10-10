from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateField, DecimalField, FormField, FieldList
from wtforms.validators import DataRequired, Length, NumberRange, ValidationError
# import wtforms_json
# wtforms_json.init()

#checking length- for special case
def length_check(FlaskForm, field):
    if len(field.data) > 100:
        raise ValidationError('Must be less than 100 characters.')

#checking amount- for special case
def amount_check(FlaskForm, field):
    if field.data <= 0:
        raise ValidationError('Must be greater than 0.')

#checking length factory - for reuseable
def length(min = 0, max = 0):
    message = 'Must be between %d and %d characters long.' % (min, max)

    def _length(FlaskForm, field):
        input_length = field.data and len(field.data) or 0
        if input_length < min or max != 0 and input_length > max:
            raise ValidationError(message)
    return _length


class DebtorDetailForm(FlaskForm):
    class Meta:
        csrf= False
    debtor_id = IntegerField('debtor_id', validators=[DataRequired()])
    owe_amount = DecimalField('owe_amount', validators=[DataRequired()])

class ExpenseForm(FlaskForm):
    #name validation
    name = StringField('name', validators=[DataRequired(),length(min=1,max=100)])
    #expense_date validation
    expense_date = DateField('expense_date', validators=[DataRequired()])
    #expense_total validation
    expense_total = DecimalField('expense_total', validators=[DataRequired(), amount_check])
    #payer_user_id validation
    payer_user_id = IntegerField('payer_user_id', validators=[DataRequired()])
    #group_id validation
    group_id = IntegerField('group_id')
    #debtor validation
    debtors = FieldList(FormField(DebtorDetailForm),min_entries=1)
