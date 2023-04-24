from flask import Blueprint, jsonify, request
from app.models import db, Comment, User
from flask_login import current_user, login_required
from ..forms import ExpenseForm

comments = Blueprint('comments', __name__)


#get a single comment
@comments.route('/all')
@login_required
def singleComment(id):
    comment = Comment.query.get(id)
    print(f'single comment {comment}')
    commentDict = comment.to_dict()
    return commentDict
