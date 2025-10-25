from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

# --- 1. YOUR USER MODEL ---
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('entrepreneur', 'Entrepreneur'),
        ('investor', 'Investor'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='entrepreneur')
    is_premium = models.BooleanField(default=False)




class Project(models.Model):
    entrepreneur = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='projects'
    )
  
    title = models.CharField(max_length=255)
    description = models.TextField()
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    is_woman_led = models.BooleanField(default=False) # ✅ ADD THIS LINE

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
    project = models.ForeignKey(
        'Project', 
        on_delete=models.CASCADE, 
        related_name='chat_messages'
    )
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"From {self.sender.username} to {self.receiver.username}: {self.message[:20]}"


# --- 3. NEW INVESTOR PROFILE MODEL ---
class InvestorProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='investor_profile')
    full_name = models.CharField(max_length=255, blank=True)
    min_budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    max_budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    areas_of_interest = models.TextField(blank=True, help_text="Comma-separated list of interests (e.g., AI, FinTech, Healthcare)")

    def __str__(self):
        return f"{self.user.username}'s Profile"


# --- 4. FIXED SIGNAL ---
# This signal creates a profile when an investor signs up
# We use settings.AUTH_USER_MODEL to safely refer to your CustomUser
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created and instance.role == 'investor':
        InvestorProfile.objects.create(user=instance)