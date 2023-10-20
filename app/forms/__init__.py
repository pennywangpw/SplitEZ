from .login_form import LoginForm
from .signup_form import SignUpForm
from .expense_formV2 import ExpenseForm, DebtorDetailForm
from .group_formV2 import GroupForm,GroupMembersDetailForm
# from .group_form import GroupForm
from .comment_form import CommentForm
from .user_form import UserForm
from .friend_form import FriendForm
import wtforms_json
wtforms_json.init()
