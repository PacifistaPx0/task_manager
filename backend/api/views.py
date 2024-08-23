import random

from django.conf import settings
from django.template.loader import render_to_string
from django.shortcuts import render
from django.core.mail import EmailMultiAlternatives


from rest_framework.response import Response
from rest_framework import status, generics, serializers
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from api.serializers import UserSerializer, RegistrationSerializer, TokenObtainPairSerializer, TaskSerializer
from userauths.models import User, Profile
from task.models import Task
from api.permissions import IsTaskCreatorOrSuperUser, IsAssignedOrReadOnly 


def generate_random_otp(length=6):
    otp = "".join([str(random.randint(0, 9)) for _ in range(length)])
    return otp


class PasswordResetEmailVerifyView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def get_object(self):
        email = self.kwargs['email'] #api/v1/password-email-verify/example@gmail.com/

        user = User.objects.filter(email=email).first()
        if user:

            uuid64 = user.pk
            refresh = RefreshToken.for_user(user) #refresh token for user
            refresh_token = str(refresh.access_token) #get the access token

            user.refresh_token = refresh_token
            user.otp = generate_random_otp()
            user.save()

            link = f"http://localhost:5173/create-new-password/?otp={user.otp}&uuid64={uuid64}&refresh_token={refresh_token}"
            
            #after getting the link, send it to user via email
            context = {
                "link": link,
                "username": user.username
            }

            subject = "Password Reset Email"
            text_body = render_to_string('email/password_reset.txt', context)
            html_body = render_to_string('email/password_reset.html', context)

            msg = EmailMultiAlternatives(
                subject=subject,
                from_email=settings.FROM_EMAIL,
                to=[user.email],
                body=text_body
            )

            msg.attach_alternative(html_body, "text/html")
            msg.send()

        return user
    
class PasswordChangeView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        payload = request.data

        otp = payload['otp']
        uuid64 = payload['uuid64']
        password = payload['password']

        user = User.objects.get(id=uuid64, otp=otp)
        if user:
            user.set_password(password)
            user.otp = ""
            user.save()

            return Response({"message": "Password changed successfully."}, status=status.HTTP_201_CREATED)
        
        else:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

class RegistrationAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = [AllowAny]


class MyTokenObtainPairAPIView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer

class TaskListView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the base queryset
        queryset = super().get_queryset()

        # If the user is a superuser, return all tasks
        if self.request.user.is_superuser:
            return queryset

        # Filter to only include tasks where the user is assigned
        queryset = queryset.filter(assigned_users=self.request.user)

        # Optionally filter by status if provided in the query parameters
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)

        return queryset
    
    #created_by field set to the authenticated user when creating a new task
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsAssignedOrReadOnly]