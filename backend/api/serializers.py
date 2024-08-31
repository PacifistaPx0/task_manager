from userauths.models import User, Profile
from task.models import Task, Comment
from api.permissions import IsTaskCreatorOrSuperUser

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.contrib.auth.password_validation import validate_password

    
class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = "__all__"

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['full_name'] = user.full_name
        token['email'] = user.email
        token['username'] = user.username

        return token

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['full_name', 'email', 'password', 'password2']

    def validate(self, attr):
        if attr['password'] != attr['password2']:
            raise serializers.ValidationError("Passwords must match.")
        return attr

    def create(self, validated_data):
        user = User.objects.create(
            full_name=validated_data['full_name'],
            email=validated_data['email'],
        )
        email_username, _ =  user.email.split('@')
        user.username = email_username
        user.set_password(validated_data['password'])
        user.save()

        return user
    
class TaskSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.email')

    class Meta:
        model = Task
        fields = ['id', 'title', 'description','status', 'created_by', 'created_at', 'updated_at', 'due_date', 'assigned_users', 'completed_at']

    # def update(self, instance, validated_data):
    #     # Check if the user is trying to update the assigned_users field
    #     request = self.context.get('request')
    #     if 'assigned_users' in validated_data:
    #         # Apply the custom permission
    #         permission = IsTaskCreatorOrSuperUser()
    #         if not permission.has_object_permission(request, None, instance):
    #             raise serializers.ValidationError("You do not have permission to assign users.")
        
    #     return super().update(instance, validated_data)
        
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    created_at = serializers.ReadOnlyField()

    class Meta:
        model = Comment
        fields = "__all__"
        read_only_fields = ['task', 'user', 'created_at']
    

