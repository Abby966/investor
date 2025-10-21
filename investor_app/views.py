from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework import generics
# users/views.py
from rest_framework.decorators import api_view, permission_classes



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
        # Only show headlines
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
        # TODO: Optionally generate NDA PDF here
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


class SignupView(APIView):
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        role = request.data.get("role", "entrepreneur")

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

        # Use create_user to hash password
        user = User.objects.create_user(username=username, email=email, password=password, role=role)

        return Response({
            "message": "Signup successful",
            "username": user.username,
            "role": user.role
        }, status=status.HTTP_201_CREATED)
class MyProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only allow user to edit/delete their own projects
        return Project.objects.filter(entrepreneur=self.request.user)
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "username": user.username,
                "role": user.role
            })
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request):
        print("📦 Incoming project data:", request.data)
        print("👤 Authenticated user:", request.user)

        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            project = serializer.save(entrepreneur=request.user)
            print("✅ Project created successfully:", project)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print("❌ Serializer errors:", serializer.errors)  # Show why validation failed
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
class ChatMessageView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, project_id, other_user_id):
        # List chat messages between current user and another user for a project
        messages = ChatMessage.objects.filter(
            project_id=project_id,
            sender_id__in=[request.user.id, other_user_id],
            receiver_id__in=[request.user.id, other_user_id]
        ).order_by('timestamp')
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request, project_id, other_user_id):
        serializer = ChatMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                sender=request.user,
                receiver_id=other_user_id,
                project_id=project_id
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ProjectListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        projects = Project.objects.exclude(entrepreneur=request.user)
        serializer = ProjectHeadlineSerializer(projects, many=True)  # hide full_description
        return Response(serializer.data)

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(entrepreneur=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class MyProjectsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        projects = Project.objects.filter(entrepreneur=request.user)
        serializer = ProjectSerializer(projects, many=True)  # full_description visible
        return Response(serializer.data)