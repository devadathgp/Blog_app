from django.shortcuts import render
from rest_framework.views import APIView
from accounts.serializers import *
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


from rest_framework.response import Response


# Create your views here.

class UserResgister(APIView):
    def post(self,request):
        serializer=UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    

class LoginUser(APIView):
    def post(self,request):
        username=request.data.get('username')
        password=request.data.get('password')

        if not username and not password:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user=authenticate(username=username,password=password)
         
        if not user:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        refresh=RefreshToken.for_user(user)
        return Response({
            "refresh":str(refresh),
            "access":str(refresh.access_token),
            'username':user.username
        },status=status.HTTP_200_OK)
    

