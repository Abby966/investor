from django.contrib import admin
from django.urls import path, include
from investor_app.views import SignupView, LoginView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('investor_app.urls')),  # Delegate to app URLs
]
