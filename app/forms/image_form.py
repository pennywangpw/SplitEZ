from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import StringField,SubmitField
from wtforms.validators import DataRequired, Email
from ..routes.AWS_helpers import ALLOWED_EXTENSIONS




class ImageForm(FlaskForm):
    # image = StringField("image_url", validators =[DataRequired()])
    image = FileField("image", validators =[FileRequired(), FileAllowed(list(ALLOWED_EXTENSIONS), "wrong format!")])
    submit = SubmitField("Create Post")
