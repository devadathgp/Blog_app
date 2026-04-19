from django.urls import path
from accounts.views import *
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path("register/",UserResgister.as_view(),name="register"),
    path('login/', LoginUser.as_view(), name='login'),
]
