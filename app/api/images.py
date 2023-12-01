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
    print(f"這裡是錯的form{form}")
    if form.validate_on_submit():
        image = form.data["image"]
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)

        if "url" not in upload:
            return "NOT IN UPLOAD"

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

# def postPicture():
#     form = ImageForm()
#     print(f"這裡是form {form}")
#     form['csrf_token'].data = request.cookies['csrf_token']
#     print(f"here's form.data {form.data}")
#     if form.validate_on_submit():
#         print("是否進到?")
#         new_picture = Image(
#             image_url = form.data["image"],
#             user_id = current_user.id
#         )

#         db.session.add(new_picture)
#         db.session.commit()
#         return {"data": new_picture.to_dict()}
#     return form.errors

# def postPicture():
#     data = request.get_json()
#     image_url = data.get('image')

#     if not image_url:
#         return jsonify({"error": "Missing 'image' field"}), 400

#     new_picture = Image(
#         image_url=image_url,
#         user_id=current_user.id
#     )

#     db.session.add(new_picture)
#     db.session.commit()

#     return new_picture.to_dict(), 201
