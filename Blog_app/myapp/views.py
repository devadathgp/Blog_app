from django.shortcuts import render
from rest_framework.views import APIView
from myapp.serializers import *
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from accounts.serializers import *
from django.db.models import F


# Create your views here.

class HomePage(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        post=Post.objects.all().order_by("-date_added")
        serializers=PostSerializer(post,many=True)
        return Response(serializers.data)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework import status

class Post_view(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        serializer = PostSerializer(post)
        return Response(serializer.data)

    def post(self, request, post_id):
        print(request.data)

        post = get_object_or_404(Post, id=post_id)
        serializer = CommentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(
                user=request.user,
                post=post
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CreatePost(APIView):
    def post(self,request):
        serializer=PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data,status=status.HTTP_200_OK)
        print(serializer.errors)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class UserDetail(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,user_id):
        user = get_object_or_404(User, id=user_id)
        posts = Post.objects.filter(user=user).order_by('-date_added')

        user_serializer = UserSerializer(user)
        post_serializer = PostSerializer(posts, many=True)
        return Response({
            "user": user_serializer.data,
            "posts": post_serializer.data
        })
    
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Like, Post
from .serializers import LikeSerializer

class LikeToggleView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        user = request.user
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        like_queryset = Like.objects.filter(user=user, post=post)

        if like_queryset.exists():
            # Logic: Unlike
            like_queryset.delete()
            post.total_likes -= 1
            post.save()
            return Response({"message": "Unliked", "likes_count": post.likes.count()}, status=status.HTTP_200_OK)
        else:
            # Logic: Like
            Like.objects.create(user=user, post=post)
            post.total_likes += 1
            post.save()
            return Response({"message": "Liked", "likes_count": post.likes.count()}, status=status.HTTP_201_CREATED)