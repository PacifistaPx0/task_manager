from rest_framework.permissions import BasePermission

class IsTaskCreatorOrSuperUser(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Only allow superuser or task creator to assign users
        if request.user.is_superuser or obj.created_by == request.user:
            return True
        return False
    
class IsAssignedOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):

        # Allow superuser to do anything
        if request.user.is_superuser:
            return True

        # Allow the creator to do anything
        if request.user == obj.created_by:
            return True
        
        # Allow read-only access for assigned users
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return obj.assigned_users.filter(id=request.user.id).exists()

        # Allow edit access if the user is assigned to the task
        if request.method in ['PUT', 'PATCH']:
            return obj.assigned_users.filter(id=request.user.id).exists()

        # Block delete access
        if request.method == 'DELETE':
            return False

        return False