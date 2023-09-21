from flask_wtf import FlaskForm
from wtforms import StringField, FormField, FieldList, IntegerField
from wtforms.validators import DataRequired, Email

class GroupMembersDetailForm(FlaskForm):
    class Meta:
        csrf= False
    email = StringField('email')
    username = StringField('username')
    member_id = IntegerField('member_id')

class GroupForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    group_members = FieldList(FormField(GroupMembersDetailForm),min_entries=1)
