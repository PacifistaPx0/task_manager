from django.contrib import admin
from .models import Task, Comment

class CommentInline(admin.TabularInline):
    model = Comment
    extra = 1  # Number of empty forms to display for adding new comments

class CommentAdmin(admin.ModelAdmin):
    list_display = ('task', 'user', 'content', 'created_at')
    search_fields = ('task__title', 'user__username', 'content')
    list_filter = ('created_at', 'user')

class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'created_by', 'due_date', 'created_at', 'updated_at')
    list_filter = ('status', 'due_date', 'created_at')
    search_fields = ('title', 'description', 'created_by__username')
    ordering = ('-created_at',)
    inlines = [CommentInline]

    # If you want to customize the form for creating/editing tasks
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'status', 'created_by', 'assigned_users', 'due_date')
        }),
        ('Important Dates', {
            'fields': ('created_at', 'updated_at', 'completed_at'),
            'classes': ('collapse',),
        }),
    )

    readonly_fields = ('created_at', 'updated_at', 'completed_at')

admin.site.register(Task, TaskAdmin)
admin.site.register(Comment, CommentAdmin)