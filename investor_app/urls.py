from django.urls import path
from .views import (
    # Auth
    SignupView, 
   
    LoginView,
    ProfileView, # General user info (id, role, etc)
    InvestorProfileView, # NEW: The investor's editable profile

    # Entrepreneur
    ProjectListCreateView, 
    MyProjectsView,
    MyProjectDetailView,
    
    # Investor
    InvestorProjectListView, 
    InvestorExpressInterestView,
    InvestorSignNDAView, 
    InvestorProjectDetailView,

    # Chat
    ChatMessageView,
    MyChatContactsView # For the chat contact list
)






urlpatterns = [
    # Auth paths
     path('', frontend_home, name='home'), 
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    
    # Profile paths
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/investor/', InvestorProfileView.as_view(), name='investor-profile'), # NEW

    # Project paths (Entrepreneur POST)
    path('projects/', ProjectListCreateView.as_view(), name='projects'), 
    path('my-projects/', MyProjectsView.as_view(), name='my-projects'),  
    path('my-projects/<int:pk>/', MyProjectDetailView.as_view(), name='my-project-detail'),
    
    # Investor-specific project paths
    path('investor/projects/', InvestorProjectListView.as_view(), name='investor_projects'), # GET other projects
    path('investor/projects/<int:project_id>/interest/', InvestorExpressInterestView.as_view(), name='investor_interest'),
    path('investor/projects/<int:project_id>/sign-nda/', InvestorSignNDAView.as_view(), name='investor_sign_nda'),
    path('investor/projects/<int:project_id>/', InvestorProjectDetailView.as_view(), name='investor_project_detail'),
    
    # Chat paths
    path('my-chats/', MyChatContactsView.as_view(), name='my-chats'),
    path('chats/<int:project_id>/<int:other_user_id>/', ChatMessageView.as_view(), name='chats'),
]
