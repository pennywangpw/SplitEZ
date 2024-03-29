from flask_wtf import FlaskForm
from wtforms import StringField, FormField, FieldList, IntegerField
from wtforms.validators import DataRequired, Email
# import wtforms_json
# wtforms_json.init()

class GroupMembersDetailForm(FlaskForm):
    class Meta:
        csrf= False
    email = StringField('email')
    username = StringField('username')
    id = IntegerField('id')

class GroupForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    group_members = FieldList(FormField(GroupMembersDetailForm),min_entries=1)
