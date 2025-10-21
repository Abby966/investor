from django.urls import path



from .views import (
    SignupView, LoginView, ProfileView,
    ProjectListCreateView, ChatMessageView,
    InvestorProjectListView, InvestorExpressInterestView,
    InvestorSignNDAView, InvestorProjectDetailView,MyProjectsView,MyProjectDetailView
)

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('projects/', ProjectListCreateView.as_view(), name='projects'),
    path('chats/<int:project_id>/<int:other_user_id>/', ChatMessageView.as_view(), name='chats'),
    path('my-projects/', MyProjectsView.as_view(), name='my-projects'),  
    path('my-projects/<int:pk>/', MyProjectDetailView.as_view(), name='my-project-detail'),
    
    # Investor endpoints
    path('investor/projects/', InvestorProjectListView.as_view(), name='investor_projects'),
    path('investor/projects/<int:project_id>/interest/', InvestorExpressInterestView.as_view(), name='investor_interest'),
    path('investor/projects/<int:project_id>/sign-nda/', InvestorSignNDAView.as_view(), name='investor_sign_nda'),
    path('investor/projects/<int:project_id>/', InvestorProjectDetailView.as_view(), name='investor_project_detail'),
]
