from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email



class UserForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    email = StringField('email', validators=[DataRequired(), Email()])
