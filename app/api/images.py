from flask import Blueprint, jsonify, request
from app.models import db, Image, User, users_groups, Expense
from flask_login import current_user, login_required
from ..forms import ImageForm
from ..routes.AWS_helpers import get_unique_filename,upload_file_to_s3,remove_file_from_s3

images = Blueprint('images', __name__)


# post a picture url
@images.route('/all', methods=['POST'])
@login_required
def postPicture():
    form = ImageForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        check_if_image_posted = Image.query.filter_by(user_id = current_user.id).first()

        if check_if_image_posted is not None :
            check_if_image_postedDict = check_if_image_posted.to_dict()
            deleted_image_url = check_if_image_postedDict["image_url"]
            remove_file_from_s3(deleted_image_url)
            db.session.delete(check_if_image_posted)
            db.session.commit()


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


#get a picture
@images.route('/<int:id>')
@login_required
def getPicture(id):
    selected_image = Image.query.filter_by(user_id = current_user.id).first()
    if selected_image:
        selected_imageDict = selected_image.to_dict()
        print(f"應該要有 {selected_imageDict}")
        return selected_imageDict

    return "There's no image in db"
