from flask import Blueprint, jsonify, request
from app.models import db, Comment, User
from flask_login import current_user, login_required
from ..forms import CommentForm

comments = Blueprint('comments', __name__)



#get all comments
@comments.route('/<int:id>/allcomments')
@login_required
def allCommentForExpense(id):
    print(f'passed in id {id}')

    '''get all comments from selected expense AND add user info'''

    comments = Comment.query.filter(Comment.expense_id == id).all()
    print(f'all the comments for the specific expense {comments}')
    for comment in comments:
        comment.user = comment.user

    print(f'AFTER ADDIND comments looks like {comments}')
    commentDict = [comment.to_dict() for comment in comments]
    print(f'all the comments for the specific expense-- {commentDict}')

    # '''get all comments from selected expense with users detail'''
    # allcomments = Comment.query.all()
    # print(f'====all comments {allcomments}')
    # allcommentsDict = [all.to_dict() for all in allcomments]

    # '''add user detail attribute'''
    # for comment in allcommentsDict:
    #     userinfo = User.query.get(comment['user_id'] == current_user.id)
    #     if userinfo != None:
    #         comment['user'] = userinfo.to_dict()

    # '''filter comments by expense_id'''
    # comments = [comment for comment in allcommentsDict if comment['expense_id'] == id]

    # print(f'all the comments for the specific expense {comments}')

    # return comments
    return commentDict



#create a comment
@comments.route('/<int:id>/allcomments', methods=['POST'])
@login_required
def createComment(id):
    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_comment = Comment(
            comment = form.data['comment'],
            user_id = current_user.id,
            expense_id = id
        )
        db.session.add(new_comment)
        db.session.commit()
        print(f'this is create new_comment {new_comment}')
        return new_comment.to_dict()
    return "Bad Data"



#delete a comment
@comments.route('/<int:id>', methods=['DELETE'])
@login_required
def deleteComment(id):
    deletecomment = Comment.query.get(id)
    print("i think i tested this- delete ", deletecomment)

    deletecommentDict = deletecomment.to_dict()
    print(f"delete a comment : {deletecommentDict}" )
    db.session.delete(deletecomment)

    db.session.commit()
    return deletecommentDict


#update a comment
@comments.route('/<int:id>', methods=['PUT'])
@login_required
def updateComment(id):
    form = CommentForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    updatedcomment = Comment.query.get(id)

    if form.validate_on_submit():
        updatedcomment.comment = form.data['comment']
        db.session.commit()
        updatedcommentDict =  updatedcomment.to_dict()
        return updatedcommentDict
    return "Bad Data-update a comment"
