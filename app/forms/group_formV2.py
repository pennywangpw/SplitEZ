from flask_wtf import FlaskForm
from wtforms import StringField, FormField, FieldList
from wtforms.validators import DataRequired, Email

class GroupMembersDetailForm(FlaskForm):
    class Meta:
        csrf= False
    email = StringField('email', validators=[DataRequired(), Email()])
    username = StringField('username', validators=[DataRequired()])

class GroupForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    group_members = FieldList(FormField(GroupMembersDetailForm),min_entries=1)
