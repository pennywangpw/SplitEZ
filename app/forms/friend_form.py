from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email



class FriendForm(FlaskForm):
    name = StringField('name')
    email = StringField('email', validators=[DataRequired(), Email()])
