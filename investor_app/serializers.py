from rest_framework import serializers
from .models import CustomUser, Project, ChatMessage, ProjectInterest
from django.contrib.auth import get_user_model
from .models import InvestorProfile 
# Get the User model
User = get_user_model()


# --- NEW CHAT SERIALIZERS ---

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role','is_premium']
       

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User # Use the CustomUser model
        fields = ['username', 'email'] # Only allow these fields to be updated
class ChatContactSerializer(serializers.ModelSerializer):
    # This serializer now correctly uses 'project.title'
    project_headline = serializers.CharField(source='project.title') 
    project_id = serializers.IntegerField(source='project.id')
    project_budget = serializers.DecimalField(source='project.budget', max_digits=12, decimal_places=2, read_only=True)
    other_user = serializers.SerializerMethodField()

    class Meta:
        model = ProjectInterest
        fields = ['project_id', 'project_headline', 'project_budget', 'other_user']

    def get_other_user(self, obj):
        request_user = self.context.get('request').user
        
        if obj.investor == request_user:
            serializer = UserDetailSerializer(obj.project.entrepreneur)
            return serializer.data
        else:
            serializer = UserDetailSerializer(obj.investor)
            return serializer.data

class ChatContactSerializer(serializers.ModelSerializer):
    project_headline = serializers.CharField(source='project.title') 
    project_id = serializers.IntegerField(source='project.id')
    project_budget = serializers.DecimalField(source='project.budget', max_digits=12, decimal_places=2, read_only=True)
    other_user = serializers.SerializerMethodField()
    
    # ✅ --- NEW FIELD ---
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = ProjectInterest
        fields = [
            'project_id', 
            'project_headline', 
            'project_budget', 
            'other_user',
            'last_message'  # ✅ Add it to the list
        ]

    def get_other_user(self, obj):
        request_user = self.context.get('request').user
        if obj.investor == request_user:
            return UserDetailSerializer(obj.project.entrepreneur).data
        else:
            return UserDetailSerializer(obj.investor).data

    # ✅ --- NEW FUNCTION TO FIND THE LAST MESSAGE ---
    def get_last_message(self, obj):
        request_user = self.context.get('request').user
        
        # Find the other user in this chat
        if obj.investor == request_user:
            other_user = obj.project.entrepreneur
        else:
            other_user = obj.investor
        
        # Find the most recent message in this chat
        last_msg = ChatMessage.objects.filter(
            project=obj.project,
            sender_id__in=[request_user.id, other_user.id],
            receiver_id__in=[request_user.id, other_user.id]
        ).order_by('-timestamp').first()
        
        # If a message exists, return its details
        if last_msg:
            return {
                'message': last_msg.message,
                'timestamp': last_msg.timestamp,
                'sender_username': last_msg.sender.username
            }
        return None # No messages yet
# --- YOUR ORIGINAL SERIALIZERS (with fixes) ---

class ProjectDetailSerializer(serializers.ModelSerializer):
    entrepreneur = serializers.ReadOnlyField(source='entrepreneur.username')

    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'entrepreneur', 'created_at']


class ProjectInterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectInterest
        fields = ['id', 'project', 'investor', 'nda_signed', 'timestamp']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'password', 'email', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
            role=validated_data.get('role', 'entrepreneur')
        )
        return user


class ChatMessageSerializer(serializers.ModelSerializer):
    
    sender = serializers.ReadOnlyField(source='sender.username')
    receiver = serializers.ReadOnlyField(source='receiver.username')
    project = serializers.ReadOnlyField(source='project.id')

    
    class Meta:
        
        model = ChatMessage
       
        fields = ['id', 'sender', 'receiver', 'project', 'message', 'timestamp']
class ProjectSerializer(serializers.ModelSerializer):
    entrepreneur = serializers.ReadOnlyField(source='entrepreneur.username')
    headline = serializers.CharField(source='title')
    full_description = serializers.CharField(source='description')

    class Meta:
        model = Project
        # ✅ 'id' is included for Edit/Delete to work
        fields = ['id', 'headline', 'full_description', 'budget', 'entrepreneur','is_woman_led']
        read_only_fields = ['entrepreneur']
  

class ProjectHeadlineSerializer(serializers.ModelSerializer):
    entrepreneur = serializers.ReadOnlyField(source='entrepreneur.username')
    headline = serializers.CharField(source='title')

    class Meta:
        model = Project
        # ✅ 'id' is included for the 'Connect' button to work
        fields = ['id', 'headline', 'budget', 'entrepreneur','is_woman_led']



class InvestorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestorProfile
        fields = ['full_name', 'min_budget', 'max_budget', 'areas_of_interest']