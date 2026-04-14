from django.urls import path
from myapp.views import *

urlpatterns = [
    path("home_page/",HomePage.as_view(),name="home_page"),
    path("create_post/",CreatePost.as_view(),name="create_post"),
    path("post_view/<int:post_id>/",Post_view.as_view(),name="post_view"),
    path("user_detail/<int:user_id>/",UserDetail.as_view(),name="user_detail"),
    path('posts/<int:post_id>/like/', LikeToggleView.as_view(), name='like-toggle'),
]
