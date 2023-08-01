from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateField, DecimalField, FormField, FieldList
from wtforms.validators import DataRequired
import wtforms_json
wtforms_json.init()


class ExpenseForm(FlaskForm):
    #validate expense name
    name = StringField('name', validators=[DataRequired()])
    #validate expense date
    expense_date = DateField('expense_date')
    #validate expense total
    expense_total = DecimalField('expense_total', validators=[DataRequired()])
    #validate payer_user_id
    payer_user_id = IntegerField('payer_user_id', validators=[DataRequired()])
    #validate payer_user_id

    group_id = IntegerField('group_id')

#validate debtor
class Debotrdetail(FlaskForm):
    class Meta:
        csrf = False
    debtor_id = IntegerField('debtor_id',validators=[DataRequired()])
    owe_Amount = DecimalField('owe_Amount', validators=[DataRequired()])

class Debtor(FlaskForm) :
    debtors_info = FieldList(FormField(Debotrdetail),min_entries=1)


# class Debotrdetail(FlaskForm):
#     class Meta:
#         csrf = False
#     debtor_id = IntegerField('debtor_id',validators=[DataRequired()])
#     owe_Amount = DecimalField('owe_Amount', validators=[DataRequired()])

# class Debtor(FlaskForm) :
#     debtor_name = StringField()
#     debtor_info = FormField(Debotrdetail)

























































# class CrabDebForm(FlaskForm):
#     class Meta:
#         csrf = False

#     id = IntegerField('id', validators=[DataRequired()])
#     amount = IntegerField('amount', validators=[DataRequired()])

# class CrabExpForm(FlaskForm):
#     payer = IntegerField('payer', validators=[DataRequired()])
#     # debtor = FormField(CrabDebForm)
#     debtors = FieldList(FormField(CrabDebForm), min_entries=1)
