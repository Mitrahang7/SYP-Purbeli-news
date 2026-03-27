from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from .models import Profile,Tag,Category,Post,Newsletter,Comment,Contact,Poll,PollOption,Promotion,VideoAd

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
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Embed is_staff directly into the JWT payload
        token['is_staff'] = user.is_staff
        
        # Safely assign is_author from profile
        is_author = hasattr(user, 'profile') and user.profile.is_author
        token['is_author'] = is_author
        
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Add extra user info to the response
        is_author = hasattr(self.user, 'profile') and self.user.profile.is_author
        data.update({
            "username": self.user.username,
            "email": self.user.email,
            "is_staff": self.user.is_staff,
            "is_author": is_author,
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
    tag = serializers.PrimaryKeyRelatedField(many=True, queryset=Tag.objects.all(), required=False)
    tag_details = TagSerializer(source='tag', many=True, read_only=True)
    author_name = serializers.ReadOnlyField(source='author.username')
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "content",
            "featured_image",
            "status",
            "tag",
            "tag_details",
            "category",
            "category_name",
            "author_name",
            "author",
            "views_count",
            "published_at", 
            "created_at",
        ]
        extra_kwargs = {
            "author": {"read_only": True},
            "views_count": {"read_only": True},
            "published_at": {"read_only": True},
        }
        
    def get_featured_image(self, obj):
        request = self.context.get("request")
        if obj.featured_image:
            return request.build_absolute_uri(obj.featured_image.url)
        return None

    def validate(self, data):
        data["author"] = self.context["request"].user
        return data
    
class PostPublishSerializer(serializers.Serializer):
    id=serializers.IntegerField()
    
class NewsletterSerializer(serializers.ModelSerializer):
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

class PollOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollOption
        fields = ['id', 'text', 'votes']

class PollSerializer(serializers.ModelSerializer):
    options = PollOptionSerializer(many=True) # Remove read_only=True to allow input

    class Meta:
        model = Poll
        fields = ['id', 'question', 'active', 'options', 'created_at']
    
    def create(self, validated_data):
        options_data = validated_data.pop('options', [])
        poll = Poll.objects.create(**validated_data)
        for option_data in options_data:
            PollOption.objects.create(poll=poll, **option_data)
        return poll

class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = '__all__'

class VideoAdSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoAd
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    is_author = serializers.BooleanField(source='profile.is_author', read_only=True)
    city = serializers.CharField(source='profile.city', read_only=True)
    phone_number = serializers.CharField(source='profile.phone_number', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_author', 'city', 'phone_number', 'is_staff']