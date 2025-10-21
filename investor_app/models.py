from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('entrepreneur', 'Entrepreneur'),
        ('investor', 'Investor'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='entrepreneur')


class Project(models.Model):
    entrepreneur = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='projects'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)  # ✅ Added budget
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ProjectInterest(models.Model):
    investor = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='interested_projects'
    )
    project = models.ForeignKey(
        'Project', 
        on_delete=models.CASCADE, 
        related_name='interests'
    )
    nda_signed = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('investor', 'project')

    def __str__(self):
        return f"{self.investor.username} -> {self.project.title} (NDA: {self.nda_signed})"


class ChatMessage(models.Model):
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='sent_messages'
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='received_messages'
    )
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='chats')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username} -> {self.receiver.username}: {self.message[:20]}"
