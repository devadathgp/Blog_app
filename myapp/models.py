from django.db import models
from accounts.models import *

class Post(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=1000)
    sub_title = models.CharField(max_length=200, blank=True, null=True)
    content = models.TextField()  # ✅ fixed
    image = models.ImageField(upload_to="image/")
    date_added = models.DateField(auto_now=True)
    total_likes = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title
    

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE,related_name="comments")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.CharField(max_length=200)
    date_added = models.DateField(auto_now=True)

    def __str__(self):
        return self.comment


class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_likes')
    
    created_at = models.DateTimeField(auto_now_add=True) # Always good for analytics

    class Meta:
        # This ensures a user can only like a post once
        unique_together = ('post', 'user')

    def __str__(self):
        return f"{self.user.username} liked {self.post.title}"