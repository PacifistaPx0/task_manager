from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

from api.views import (RegistrationAPIView, MyTokenObtainPairAPIView, 
                       PasswordResetEmailVerifyView, PasswordChangeView,
                       TaskListView, TaskDetailView)


urlpatterns = [
    path('user/register/', RegistrationAPIView.as_view(), name='register-user'),
    path('user/token/', MyTokenObtainPairAPIView.as_view(), name='token_obtain'),
    path('user/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # new path for token refreshing
    path('user/password-reset/<email>/', PasswordResetEmailVerifyView.as_view(), name='password-reset'),
    path('user/password-change/', PasswordChangeView.as_view(), name='password-change'),

    path('tasks/', TaskListView.as_view(), name='task-list'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail')
]