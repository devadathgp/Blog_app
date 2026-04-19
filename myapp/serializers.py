from rest_framework import serializers
from myapp.models import *

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    post = serializers.PrimaryKeyRelatedField(read_only=True)  # ✅ ADD THIS

    class Meta:
        model = Comment
        fields = "__all__"
class PostSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields ="__all__"
    


class LikeSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Like
        fields = ['id', 'user', 'post', 'created_at']

    def validate(self, data):
        user = self.context['request'].user
        post = data.get('post')

        if Like.objects.filter(user=user, post=post).exists():
            raise serializers.ValidationError("You have already liked this post.")
        return data
    def get_likes_count(self, obj):
        return obj.likes.count()  # 'likes' comes from the related_name in the Like model