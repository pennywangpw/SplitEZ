from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateField, DecimalField, FormField, FieldList
from wtforms.validators import DataRequired
import wtforms_json
wtforms_json.init()


class ExpenseForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    expense_date = DateField('expense_date')
    expense_total = DecimalField('expense_total', validators=[DataRequired()])
    payer_user_id = IntegerField('payer_user_id', validators=[DataRequired()])
    group_id = IntegerField('group_id')


# class Debotrdetail(FlaskForm):
#     class Meta:
#         csrf = False
#     debtor_id = IntegerField('debtor_id',validators=[DataRequired()])
#     owe_Amount = DecimalField('owe_Amount', validators=[DataRequired()])

# class Debtor(FlaskForm) :
#     debtor_name = StringField()
#     debtor_info = FormField(Debotrdetail)


class Debotrdetail(FlaskForm):
    class Meta:
        csrf = False
    debtor_id = IntegerField('debtor_id',validators=[DataRequired()])
    owe_Amount = DecimalField('owe_Amount', validators=[DataRequired()])

class Debtor(FlaskForm) :
    debtor_name = StringField()
    debtors_info = FieldList(FormField(Debotrdetail),min_entries=1)























































# class CrabDebForm(FlaskForm):
#     class Meta:
#         csrf = False

#     id = IntegerField('id', validators=[DataRequired()])
#     amount = IntegerField('amount', validators=[DataRequired()])

# class CrabExpForm(FlaskForm):
#     payer = IntegerField('payer', validators=[DataRequired()])
#     # debtor = FormField(CrabDebForm)
#     debtors = FieldList(FormField(CrabDebForm), min_entries=1)
