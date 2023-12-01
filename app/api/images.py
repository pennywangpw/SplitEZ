from flask import Blueprint, jsonify, request
from app.models import db, Image, User, users_groups, Expense
from flask_login import current_user, login_required
from ..forms import ImageForm
from ..routes.AWS_helpers import get_unique_filename,upload_file_to_s3

images = Blueprint('images', __name__)


# post a picture url
@images.route('/all', methods=['POST'])
@login_required
def postPicture():
    form = ImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        image = form.data["image"]
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)
        print(f"upload  {upload}")

        if "url" not in upload:
            return "something wrong in upload function"

        new_picture = Image(
            image_url = upload["url"],
            user_id = current_user.id
        )

        db.session.add(new_picture)
        db.session.commit()
        return {"data": new_picture.to_dict()}
    if form.errors:
        print(form.errors)
        return form.erros
