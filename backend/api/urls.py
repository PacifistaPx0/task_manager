from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

from api.views import (ProfileView, UserListView, UserDetailView, RegistrationAPIView, MyTokenObtainPairAPIView, 
                       PasswordResetEmailVerifyView, PasswordChangeView,
                       TaskListView, TaskDetailView, CommentListView, CommentDetailView)


urlpatterns = [

    path('users/', UserListView.as_view(), name='user-list'),
    
    path('user/profile/', ProfileView.as_view(), name='profile'),
    path('user/detail/', UserDetailView.as_view(), name='user-detail'),
    path('user/register/', RegistrationAPIView.as_view(), name='register-user'),
    path('user/token/', MyTokenObtainPairAPIView.as_view(), name='token_obtain'),
    path('user/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # new path for token refreshing
    path('user/password-reset/<email>/', PasswordResetEmailVerifyView.as_view(), name='password-reset'),
    path('user/password-change/', PasswordChangeView.as_view(), name='password-change'),

    path('tasks/', TaskListView.as_view(), name='task-list'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('tasks/<int:task_id>/comments/', CommentListView.as_view(), name='comment-list'),
    path('tasks/<int:task_id>/comments/<int:pk>/', CommentDetailView.as_view(), name='comment-detail'),
]