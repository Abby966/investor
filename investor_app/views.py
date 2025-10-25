from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework import generics

from django.shortcuts import render

def frontend_home(request):
    return render(request, "index.html")  # Your frontend build entry point


from .models import CustomUser, Project, ChatMessage, ProjectInterest
from .serializers import (
    UserSerializer,
    ProjectSerializer,
    ChatMessageSerializer,
    ProjectHeadlineSerializer,
    ProjectDetailSerializer,
    ProjectInterestSerializer
)


User = get_user_model()

from .serializers import UserDetailSerializer,UserUpdateSerializer
# ... (other imports)
from .models import ProjectInterest 
from .serializers import ChatContactSerializer 
from django.db.models import Q 

from .models import InvestorProfile # 
from .serializers import InvestorProfileSerializer 


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)

    # ✅ ADD THIS PUT METHOD
    def put(self, request):
        user = request.user
        # Use partial=True to allow updating only username or only email
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            # Check for username uniqueness manually if needed (DRF doesn't always enforce on partial update)
            new_username = serializer.validated_data.get('username')
            if new_username and User.objects.exclude(pk=user.pk).filter(username=new_username).exists():
                 return Response({"username": ["A user with that username already exists."]}, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            # Return updated details using the Detail serializer
            return Response(UserDetailSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# ... (rest of your views) ...
class InvestorProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'investor':
            return Response({"error": "Only investors have this profile."}, status=status.HTTP_403_FORBIDDEN)
        
        # get_or_create ensures a profile exists even for older users
        profile, created = InvestorProfile.objects.get_or_create(user=request.user)
        serializer = InvestorProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        if request.user.role != 'investor':
            return Response({"error": "Only investors have this profile."}, status=status.HTTP_403_FORBIDDEN)
        
        profile, created = InvestorProfile.objects.get_or_create(user=request.user)
        serializer = InvestorProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class MyChatContactsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        
        interests = ProjectInterest.objects.filter(
            Q(investor=request.user) | # I am the investor
            Q(project__entrepreneur=request.user) # I am the entrepreneur
        )
        
        
        serializer = ChatContactSerializer(interests, many=True, context={'request': request})
        return Response(serializer.data)

class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)
class ProjectListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        projects = Project.objects.exclude(entrepreneur=request.user)
        serializer = ProjectHeadlineSerializer(projects, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(entrepreneur=request.user)
            # ✅ THE FIX IS HERE:
            return Response(serializer.data, status=status.HTTP_201_CREATED) # Was 21
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Use your existing UserSerializer to create the user
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "User created successfully"},
                status=status.HTTP_201_CREATED
            )
        
        # If data is bad, return the serializer errors
        print(f"❌ Signup errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {"error": "Please provide both username and password"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            
            # ✅ THE FIX IS HERE: We now also return the user's role
            return Response({
                "token": token.key,
                "role": user.role  # <-- This is the new line
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Invalid username or password"},
                status=status.HTTP_400_BAD_REQUEST
            )

# ... (rest of your views.py)
# --- ALL YOUR OTHER VIEWS (These are fine) ---

class UpdateNDAView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        project_interest = get_object_or_404(ProjectInterest, pk=pk, investor=request.user)
        project_interest.nda_signed = True
        project_interest.save()
        serializer = ProjectInterestSerializer(project_interest)
        return Response(serializer.data)

class InvestorProjectListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        projects = Project.objects.exclude(entrepreneur=request.user)
        serializer = ProjectHeadlineSerializer(projects, many=True)
        return Response(serializer.data)

class InvestorExpressInterestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, project_id):
        project = get_object_or_404(Project, id=project_id)
        interest, created = ProjectInterest.objects.get_or_create(
            investor=request.user, project=project
        )
        serializer = ProjectInterestSerializer(interest)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class InvestorSignNDAView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, project_id):
        interest = get_object_or_404(ProjectInterest, investor=request.user, project_id=project_id)
        interest.nda_signed = True
        interest.save()
        serializer = ProjectInterestSerializer(interest)
        return Response(serializer.data)

class InvestorProjectDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, project_id):
        interest = get_object_or_404(ProjectInterest, investor=request.user, project_id=project_id)
        if not interest.nda_signed:
            return Response({'error': 'NDA not signed'}, status=status.HTTP_403_FORBIDDEN)
        project = interest.project
        serializer = ProjectDetailSerializer(project)
        return Response(serializer.data)

class ChatMessageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    
    def get(self, request, project_id, other_user_id):
        # ✅ TWO indent levels (e.g., 8 spaces)
        messages = ChatMessage.objects.filter(
            project_id=project_id,
            sender_id__in=[request.user.id, other_user_id],
            receiver_id__in=[request.user.id, other_user_id]
        ).order_by('timestamp')
        
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)

    # ✅ ONE indent level
    def post(self, request, project_id, other_user_id):
        # ✅ TWO indent levels
        serializer = ChatMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                sender=request.user,
                receiver_id=other_user_id,
                project_id=project_id
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class MyProjectsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        projects = Project.objects.filter(entrepreneur=request.user)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

class MyProjectDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Project.objects.get(pk=pk, entrepreneur=user)
        except Project.DoesNotExist:
            return None

    def get(self, request, pk):
        project = self.get_object(pk, request.user)
        if project is None:
            return Response({"error": "Project not found or you do not have permission."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ProjectSerializer(project)
        return Response(serializer.data)

    def put(self, request, pk):
        project = self.get_object(pk, request.user)
        if project is None:
            return Response({"error": "Project not found or you do not have permission."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ProjectSerializer(project, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        project = self.get_object(pk, request.user)
        if project is None:
            return Response({"error": "Project not found or you do not have permission."}, status=status.HTTP_404_NOT_FOUND)
        
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
