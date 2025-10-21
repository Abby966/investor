from rest_framework import serializers
from .models import CustomUser, Project, ChatMessage, ProjectInterest



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
    headline = serializers.CharField(source='title')  # frontend uses 'headline'
    full_description = serializers.CharField(source='description')  # frontend uses 'full_description'

    class Meta:
        model = Project
        fields = ['headline', 'full_description', 'budget', 'entrepreneur']
        read_only_fields = ['entrepreneur']

# Serializer for listing other projects with hidden description
class ProjectHeadlineSerializer(serializers.ModelSerializer):
    entrepreneur = serializers.ReadOnlyField(source='entrepreneur.username')
    headline = serializers.CharField(source='title')

    class Meta:
        model = Project
        fields = ['id', 'headline', 'budget', 'entrepreneur']  # full_description omitted