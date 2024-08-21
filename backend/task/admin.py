from django.contrib import admin
from .models import Task

class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'created_by', 'due_date', 'created_at', 'updated_at')
    list_filter = ('status', 'due_date', 'created_at')
    search_fields = ('title', 'description', 'created_by__username')
    ordering = ('-created_at',)

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