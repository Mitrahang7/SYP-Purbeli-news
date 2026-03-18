from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from .models import Profile,Tag,Category,Post,Newsletter,Comment,Contact

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    city = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 'city', 'phone_number']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return attrs

    def create(self, validated_data):
        # Pop extra fields
        validated_data.pop('confirm_password')
        city = validated_data.pop('city')
        phone_number = validated_data.pop('phone_number')

        # Create User (password is hashed automatically)
        user = User.objects.create_user(**validated_data)

        # Create Profile
        Profile.objects.create(user=user, city=city, phone_number=phone_number)

        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Add extra user info to the response
        data.update({
            "username": self.user.username,
            "email": self.user.email,
        })
        return data

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']
        
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']
        
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "content",
            "featured_image",
            "status",
            "tag",
            "category",
            # read only
            "author",
            "views_count",
            "published_at", 
        ]
        extra_kwargs = {
            "author": {"read_only": True},
            "views_count": {"read_only": True},
            "published_at": {"read_only": True},
        }
        
    def validate(self, data):
        data["author"] = self.context["request"].user
        return data
    
class PostPublishSerializer(serializers.Serializer):
    id=serializers.IntegerField()
    
class NewsletterSerializer(serializers.Serializer):
    class Meta:
        model=Newsletter
        fields='__all__'
class ContactSerializer(serializers.Serializer):
   
    class Meta:
        model=Contact
        fields='--all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Comment
        fields='__all__'
    