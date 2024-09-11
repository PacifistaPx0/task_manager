from userauths.models import User, Profile
from task.models import Task, Comment
from api.permissions import IsTaskCreatorOrSuperUser

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from django.contrib.auth.password_validation import validate_password

    
class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'username' ]

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
    assigned_users = serializers.PrimaryKeyRelatedField(
        many=True, queryset=User.objects.all(), required=False
    )

    class Meta:
        model = Task
        fields = ['id', 'title', 'description','status', 'created_by', 'created_at', 'updated_at', 'due_date', 'assigned_users', 'completed_at']

    # Customizing how the assigned_users field is represented in the response
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Overwrite assigned_users with detailed user info
        representation['assigned_users'] = UserSerializer(instance.assigned_users, many=True).data
        return representation
    
    # Field-level validation for assigned_users
    def validate_assigned_users(self, new_assigned_users):
        existing_users = []
        # Check if this is an update request (self.instance will be the current task object)
        if self.instance and self.instance.assigned_users.exists():
            # Get the existing assigned users
            existing_users = list(self.instance.assigned_users.all())
        
        # Append the new users to the existing ones, ensuring no duplicates
        combined_users = list(set(existing_users + new_assigned_users))
        
        return combined_users
        
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    created_at = serializers.ReadOnlyField()

    class Meta:
        model = Comment
        fields = "__all__"
        read_only_fields = ['task', 'user', 'created_at']
    

